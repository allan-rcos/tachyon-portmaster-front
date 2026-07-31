/**
 * Cliente HTTP do SDK. `createClient` monta uma instância ofetch
 * configurada (baseURL, cookies, credenciais) e carrega o formato
 * de wire escolhido pelo app (JSON em dev, FlatBuffers em prod).
 *
 * Este módulo é PURO: não lê variáveis de ambiente, não conhece `/api`
 * nem Vike/txiki. Quem injeta baseURL, headers e wire é o app
 * (features/core/api/client.ts).
 *
 * @packageDocumentation
 */
import { ofetch, type $Fetch } from 'ofetch';

/** Formato de serialização no fio. */
export type WireFormat = 'json' | 'fbs';

/** Cliente HTTP configurado: instância de fetch mais o formato de wire ativo. */
export interface ApiClient {
  /** Instância ofetch configurada (baseURL/headers/credenciais). */
  fetch: $Fetch;
  /** Formato de wire ativo — decide se os codecs FBS são usados. */
  wire: WireFormat;
}

/** Configuração de um cliente — tudo o que o Model não descobre sozinho. */
export interface CreateClientConfig {
  /** Base das chamadas: `/api` (browser) ou loopback do Rust (server). */
  baseURL: string;
  /** `json` (dev/testes) ou `fbs` (prod). Default: `json`. */
  wire?: WireFormat;
  /** Headers fixos por client — ex.: `Cookie` encaminhado no SSR. */
  headers?: Record<string, string>;
  /** `include` no browser para enviar o cookie HTTP-only `auth_token`. */
  credentials?: RequestCredentials;
  /** Relay de `Set-Cookie`: recebe os cabeçalhos da resposta do Rust. */
  onSetCookie?: (cookies: string[]) => void;
}

/**
 * Monta um cliente HTTP com baseURL, cabeçalhos e credenciais dados.
 *
 * @param config Origem, formato de wire e política de cookies.
 */
export function createClient(config: CreateClientConfig): ApiClient {
  const fetch = ofetch.create({
    baseURL: config.baseURL,
    headers: config.headers,
    credentials: config.credentials,
    onResponse: config.onSetCookie
      ? ({ response }) => {
          const setCookies = response.headers.getSetCookie?.() ?? [];
          if (setCookies.length) config.onSetCookie!(setCookies);
        }
      : undefined,
  });
  return { fetch, wire: config.wire ?? 'json' };
}
