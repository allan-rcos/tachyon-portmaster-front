import { getContainer as apiGetContainer } from '@model/containers';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

/**
 * id base62 opaco — sem conversão.
 * @param id Identificador base62 do contêiner, sem conversão.
 * @param headers Cabeçalhos do request no SSR; omitir no navegador.
 */
export function getContainer(id: string, headers?: IncomingHeaders) {
  return apiGetContainer(resolveClient(headers), id);
}
