import { listProducts as apiListProducts } from '@model/products';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

/**
 * Lista o catálogo de produtos.
 *
 * Pede o catálogo inteiro por padrão: o editor de manifesto precisa de todos os
 * produtos disponíveis num select, não de uma página.
 *
 * @param headers Cabeçalhos do request no SSR; omitir no navegador.
 * @param query   Query string da rota (cursor e busca).
 */
export function listProducts(headers?: IncomingHeaders, query?: URLSearchParams) {
  const params: Record<string, string> = { limit: query?.get('limit') ?? '50' };
  const cursor = query?.get('cursor');
  if (cursor) params.cursor = cursor;
  const search = query?.get('search');
  if (search) params.search = search;
  return apiListProducts(resolveClient(headers), params);
}
