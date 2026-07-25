// ============================================================
//  Clients do SDK configurados para o app. O SDK (tachyon-portmaster-sdk)
//  é puro; aqui injetamos o que ele não conhece: baseURL vinda do ENV,
//  o cookie de sessão (SSR) e o formato de wire (JSON dev / FBS prod).
//
//   • browserClient — islands (browser → Nginx → Rust via `/api`).
//   • serverClient(headers) — loaders (txiki → Rust, loopback), encaminha
//     o Cookie do request e captura Set-Cookie para relay no SSR.
// ============================================================
import { createClient, type ApiClient } from '@model/core';

/** JSON em dev/teste, FlatBuffers binário em produção. */
const WIRE = import.meta.env.PROD ? 'fbs' : 'json';

export const browserClient: ApiClient = createClient({
  baseURL: import.meta.env.PUBLIC_ENV__API_BASE_URL ?? '/api',
  wire: WIRE,
  credentials: 'include',
});

export type IncomingHeaders = Headers | Record<string, string | string[] | undefined> | undefined;

export function readHeader(headers: IncomingHeaders, name: string): string | undefined {
  if (!headers) return undefined;
  if (headers instanceof Headers) return headers.get(name) ?? undefined;
  const v = headers[name] ?? headers[name.toLowerCase()];
  return Array.isArray(v) ? v.join('; ') : v;
}

/** Client server-side para um request. Encaminha o Cookie ao Rust e,
 *  se `onSetCookie` for dado, captura o Set-Cookie para relay no SSR. */
export function serverClient(
  headers?: IncomingHeaders,
  onSetCookie?: (cookies: string[]) => void,
): ApiClient {
  const cookie = readHeader(headers, 'cookie');
  return createClient({
    baseURL: import.meta.env.PUBLIC_ENV__API_SERVER_URL ?? 'http://127.0.0.1:8080',
    wire: WIRE,
    headers: cookie ? { cookie } : undefined,
    onSetCookie,
  });
}
