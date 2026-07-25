import { getUser as apiGetUser } from '@model/users';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

/**
 * Busca um usuário pelo id opaco.
 *
 * @param id      Identificador base62 do usuário, sem conversão.
 * @param headers Cabeçalhos do request no SSR; omitir no navegador.
 */
export function getUser(id: string, headers?: IncomingHeaders) {
  return apiGetUser(resolveClient(headers), id);
}
