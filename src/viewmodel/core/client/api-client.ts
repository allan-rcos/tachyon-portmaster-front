// ============================================================
//  Clients HTTP configurados para o app. O Model é puro; aqui injetamos o que
//  ele não conhece: baseURL vinda do ENV, o cookie de sessão (SSR) e o formato
//  de wire (JSON dev / FBS prod).
//
//   • browserClient — navegador → Nginx → Rust via `/api`.
//   • serverClient(headers) — txiki → Rust em loopback; encaminha o Cookie do
//     request e captura Set-Cookie para relay no SSR.
//   • resolveClient(headers) — escolhe entre os dois pela PRESENÇA de headers.
//
//  `resolveClient` é o que torna as queries indiferentes ao lado em que rodam:
//  com headers é servidor, sem headers é navegador. Mover uma tela de SSR para
//  o cliente deixa de tocar a query — só deixa de passar os headers.
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

/**
 * Lê um cabeçalho independentemente do formato em que ele chega.
 *
 * O SSR entrega ora um `Headers`, ora um objeto simples cujo valor pode ser
 * array; esta função normaliza os dois casos.
 *
 * @param headers Cabeçalhos do request.
 * @param name    Nome do cabeçalho, sem diferenciar maiúsculas.
 */
export function readHeader(headers: IncomingHeaders, name: string): string | undefined {
  if (!headers) return undefined;
  if (headers instanceof Headers) return headers.get(name) ?? undefined;
  const v = headers[name] ?? headers[name.toLowerCase()];
  return Array.isArray(v) ? v.join('; ') : v;
}

/** Client server-side para um request. Encaminha o Cookie ao Rust e,
 * @param headers Cabeçalhos do request no SSR; omitir no navegador.
 * @param onSetCookie Recebe os `Set-Cookie` da resposta, para relay no SSR.
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

/**
 * Escolhe o client conforme o contexto de execução.
 *
 * @param headers Cabeçalhos do request no SSR; omitir no navegador — onde o
 *   cookie de sessão já viaja sozinho, via `credentials: 'include'`.
 */
export function resolveClient(headers?: IncomingHeaders): ApiClient {
  return headers === undefined ? browserClient : serverClient(headers);
}
