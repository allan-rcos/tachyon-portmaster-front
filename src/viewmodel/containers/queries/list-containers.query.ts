import { listContainers as apiListContainers } from '@model/containers';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

const PAGE_SIZE = '8';

/**
 * Lista contêineres com filtros e paginação por cursor.
 *
 * @param headers Cabeçalhos do request no SSR; omitir no navegador.
 * @param query   Query string da rota (limite, cursor, busca e status).
 */
export function listContainers(headers?: IncomingHeaders, query?: URLSearchParams) {
  const params: Record<string, string> = { limit: query?.get('limit') ?? PAGE_SIZE };
  const cursor = query?.get('cursor');
  if (cursor) params.cursor = cursor;
  const search = query?.get('search');
  if (search) params.search = search;
  const status = query?.get('status');
  if (status) params.status = status;
  return apiListContainers(resolveClient(headers), params);
}
