import { getProduct as apiGetProduct } from '@model/products';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

/**
 * Busca um produto pelo id opaco.
 *
 * @param id      Identificador base62 do produto, sem conversão.
 * @param headers Cabeçalhos do request no SSR; omitir no navegador.
 */
export function getProduct(id: string, headers?: IncomingHeaders) {
  return apiGetProduct(resolveClient(headers), id);
}
