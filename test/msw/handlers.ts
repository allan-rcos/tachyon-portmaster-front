// ============================================================
//  Handlers MSW: interceptam as chamadas fetch dos clients (server e
//  browser) nas rotas /v1/* — em qualquer origem (loopback ou /api) —
//  e delegam ao resolver in-memory. Respondem SEMPRE em JSON (nos
//  testes o wire é JSON, pois import.meta.env.PROD é false).
// ============================================================
import { http, HttpResponse, passthrough } from 'msw';

import { MockApiError } from './error';
import { resolveMock } from './resolver';

async function handle(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const idx = url.pathname.indexOf('/v1/');
  if (idx === -1) return passthrough();

  const path = url.pathname.slice(idx); // normaliza "/api/v1/x" e "http://host/v1/x" → "/v1/x"
  const method = request.method.toUpperCase();

  let body: unknown;
  if (method !== 'GET' && method !== 'DELETE') {
    const text = await request.text();
    body = text ? JSON.parse(text) : {};
  }

  // Auth por cookie: o server-side envia o header Cookie explicitamente; nas
  // islands (jsdom) o cookie não é anexado ao fetch, então caímos para o
  // document.cookie do ambiente de teste.
  const cookie =
    request.headers.get('cookie') ??
    (typeof document !== 'undefined' ? document.cookie : undefined) ??
    undefined;

  try {
    const data = resolveMock({ method, path, query: url.searchParams, body, cookie });
    if (data === null || data === undefined) return new HttpResponse(null, { status: 204 });
    return HttpResponse.json(data);
  } catch (e) {
    if (e instanceof MockApiError) {
      return HttpResponse.json({ message: e.message }, { status: e.status });
    }
    throw e;
  }
}

export const handlers = [http.all('*', ({ request }) => handle(request))];
