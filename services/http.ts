// ============================================================
//  Núcleo do cliente REST. Um `Codec` descreve uma operação
//  (método + path + encode/decode). `call()` é o transporte real
//  (fetch) contra o swagger.
//
//  Negociação de wire: JSON em desenvolvimento, FlatBuffers em
//  produção (import.meta.env.PROD). Os cabeçalhos Accept/Content-Type
//  refletem o formato. Um codec só usa FBS se fornecer os adaptadores
//  `fbsEncode`/`fbsDecode` (senão cai para JSON, mesmo em prod).
// ============================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const WIRE_JSON = 'application/json';
const WIRE_FBS = 'application/x-flatbuffers';

/** Em produção o wire preferencial é FlatBuffers; em dev/teste é JSON. */
const PREFER_FBS = import.meta.env.PROD;

/** Argumentos genéricos de uma chamada: id no path, corpo, query. */
export interface CallArgs<Body = unknown> {
  params?: Record<string, string>;
  query?: URLSearchParams | Record<string, string>;
  body?: Body;
}

/** Um codec por operação REST. */
export interface Codec<Req extends CallArgs = CallArgs, Res = unknown> {
  method: HttpMethod;
  /** Path relativo (sem host), ex.: `/v1/containers` ou `/v1/containers/${id}`. */
  path: (req: Req) => string;
  /** Objeto do corpo a enviar em JSON (ou undefined em GET/DELETE). */
  encode: (req: Req) => unknown;
  /** Recebe o JSON já parseado e devolve o tipo de resposta. */
  decode: (raw: unknown) => Res;
  /** Serializa o corpo em FlatBuffers (prod). Ausente → corpo vai em JSON. */
  fbsEncode?: (req: Req) => Uint8Array;
  /** Desserializa a resposta FlatBuffers (prod). Ausente → resposta em JSON. */
  fbsDecode?: (bytes: Uint8Array) => Res;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message?: string,
    public detail?: unknown,
  ) {
    super(message ?? `HTTP ${status}`);
    this.name = 'HttpError';
  }
}

/** Monta a query string a partir de URLSearchParams ou objeto. */
export function toQueryString(query?: CallArgs['query']): string {
  if (!query) return '';
  const sp = query instanceof URLSearchParams ? query : new URLSearchParams(query);
  const s = sp.toString();
  return s ? `?${s}` : '';
}

/** Transporte real via fetch (Web Standard). */
export async function call<Req extends CallArgs, Res>(
  codec: Codec<Req, Res>,
  req: Req,
  opts: { baseUrl: string; headers?: HeadersInit },
): Promise<Res> {
  const url = opts.baseUrl + codec.path(req) + toQueryString(req.query);
  const jsonBody = codec.method === 'GET' ? undefined : codec.encode(req);

  // FBS só quando preferido (prod) E o codec tem o adaptador correspondente.
  const useFbsBody = PREFER_FBS && jsonBody !== undefined && !!codec.fbsEncode;
  const useFbsResp = PREFER_FBS && !!codec.fbsDecode;

  let body: BodyInit | undefined;
  let contentType: string | undefined;
  if (jsonBody !== undefined) {
    if (useFbsBody) {
      // Uint8Array é um BodyInit válido em runtime; o cast contorna a variância
      // de ArrayBufferLike vs ArrayBuffer nas libs recentes do TS.
      body = codec.fbsEncode!(req) as unknown as BodyInit;
      contentType = WIRE_FBS;
    } else {
      body = JSON.stringify(jsonBody);
      contentType = WIRE_JSON;
    }
  }

  const res = await fetch(url, {
    method: codec.method,
    headers: {
      accept: useFbsResp ? WIRE_FBS : WIRE_JSON,
      ...(contentType ? { 'content-type': contentType } : {}),
      ...opts.headers,
    },
    body,
    credentials: 'include',
  });

  if (!res.ok) {
    let detail: unknown;
    try {
      detail = await res.json();
    } catch {
      /* corpo vazio/não-JSON */
    }
    throw new HttpError(res.status, `HTTP ${res.status}`, detail);
  }

  if (res.status === 204) return codec.decode(null);

  const respType = res.headers.get('content-type') ?? '';
  if (codec.fbsDecode && respType.includes('flatbuffers')) {
    return codec.fbsDecode(new Uint8Array(await res.arrayBuffer()));
  }
  return codec.decode(await res.json());
}
