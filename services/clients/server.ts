// ============================================================
//  Cliente server-side (loaders/txiki). Loopback ao Rust, encaminha
//  o Cookie do request para o swagger real.
// ============================================================
import { call, type CallArgs, type Codec } from '@/services/http';

// Base loopback do Rust, vinda do ambiente. Prefixo PUBLIC_ENV__ porque este
// módulo entra no grafo do bundle client (Vike bloqueia var sem prefixo aqui);
// é só uma URL de infraestrutura (não-secreta) e só é usada server-side.
const SERVER_BASE = import.meta.env.PUBLIC_ENV__API_SERVER_URL ?? 'http://127.0.0.1:8080';

export type IncomingHeaders = Headers | Record<string, string | string[] | undefined> | undefined;

export function readHeader(headers: IncomingHeaders, name: string): string | undefined {
  if (!headers) return undefined;
  if (headers instanceof Headers) return headers.get(name) ?? undefined;
  const v = headers[name] ?? headers[name.toLowerCase()];
  return Array.isArray(v) ? v.join('; ') : v;
}

export async function serverCall<Req extends CallArgs, Res>(
  codec: Codec<Req, Res>,
  req: Req,
  headers?: IncomingHeaders,
): Promise<Res> {
  const cookie = readHeader(headers, 'cookie');
  const fwd: Record<string, string> = {};
  if (cookie) fwd.cookie = cookie;
  return call(codec, req, { baseUrl: SERVER_BASE, headers: fwd });
}
