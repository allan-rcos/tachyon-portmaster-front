import { listUsers as apiListUsers } from '@model/users';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

/**
 * Lista os usuários com seus perfis.
 *
 * @param headers Cabeçalhos do request no SSR; omitir no navegador.
 * @param query   Query string da rota (cursor).
 */
export function listUsers(headers?: IncomingHeaders, query?: URLSearchParams) {
  const params: Record<string, string> = { limit: query?.get('limit') ?? '50' };
  const cursor = query?.get('cursor');
  if (cursor) params.cursor = cursor;
  const search = query?.get('search');
  if (search) params.search = search;
  return apiListUsers(resolveClient(headers), params);
}
