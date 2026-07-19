// ============================================================
//  Cliente browser-side (islands). Vai à API do swagger via
//  PUBLIC_ENV__API_BASE_URL (em prod, /api → Nginx → Rust).
//  Cookies HTTP-only (auth_token) viajam via credentials:'include'.
// ============================================================
import { call, type CallArgs, type Codec } from '@/services/http';

export async function browserCall<Req extends CallArgs, Res>(
  codec: Codec<Req, Res>,
  req: Req,
): Promise<Res> {
  return call(codec, req, { baseUrl: import.meta.env.PUBLIC_ENV__API_BASE_URL ?? '/api' });
}
