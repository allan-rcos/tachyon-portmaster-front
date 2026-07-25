// ============================================================
//  Transporte por operação. `wire()` executa uma chamada REST via
//  ofetch negociando o formato: JSON quando `client.wire === 'json'`;
//  FlatBuffers quando `client.wire === 'fbs'` E a operação fornece os
//  adaptadores `encode`/`decode` (senão cai para JSON, mesmo em prod).
//
//  ofetch cobre parse de JSON, querystring e erro (FetchError em não-2xx).
// ============================================================
import type { ApiClient } from './http';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface WireSpec<Res> {
  method: HttpMethod;
  /** Path relativo ao baseURL, ex.: `/v1/containers` ou `/v1/containers/${id}`. */
  path: string;
  query?: Record<string, string>;
  /** Corpo em objeto de domínio (JSON). Ausente em GET/DELETE. */
  body?: unknown;
  /** Serializa o corpo em FlatBuffers (prod). Ausente → corpo JSON. */
  encode?: (body: never) => Uint8Array;
  /** Desserializa a resposta FlatBuffers (prod). Ausente → resposta JSON. */
  decode?: (bytes: Uint8Array) => Res;
}

const WIRE_JSON = 'application/json';
const WIRE_FBS = 'application/x-flatbuffers';

export async function wire<Res>(client: ApiClient, spec: WireSpec<Res>): Promise<Res> {
  const useFbsBody = client.wire === 'fbs' && spec.body !== undefined && !!spec.encode;
  const useFbsResp = client.wire === 'fbs' && !!spec.decode;

  const headers: Record<string, string> = {
    accept: useFbsResp ? WIRE_FBS : WIRE_JSON,
  };

  let body: BodyInit | undefined;
  if (spec.body !== undefined) {
    if (useFbsBody) {
      // Uint8Array é um BodyInit válido em runtime; o cast contorna a
      // variância de ArrayBufferLike vs ArrayBuffer nas libs recentes do TS.
      body = spec.encode!(spec.body as never) as unknown as BodyInit;
      headers['content-type'] = WIRE_FBS;
    } else {
      body = JSON.stringify(spec.body);
      headers['content-type'] = WIRE_JSON;
    }
  }

  if (useFbsResp) {
    // Sem generics: `responseType: 'arrayBuffer'` faz o ofetch inferir ArrayBuffer.
    const arrayBuf = (await client.fetch(spec.path, {
      method: spec.method,
      query: spec.query,
      headers,
      body,
      responseType: 'arrayBuffer',
    })) as ArrayBuffer;
    return spec.decode!(new Uint8Array(arrayBuf));
  }

  const res = await client.fetch(spec.path, {
    method: spec.method,
    query: spec.query,
    headers,
    body,
  });
  // 204/corpo vazio → ofetch devolve null/'' ; normalizamos para null.
  return (res ?? null) as Res;
}
