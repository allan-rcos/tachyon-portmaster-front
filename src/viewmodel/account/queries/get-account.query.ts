import { getAccount as apiGetAccount } from '@model/account';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

/**
 * Busca o perfil do usuário autenticado.
 *
 * @param headers Cabeçalhos do request no SSR; omitir no navegador.
 */
export function getAccount(headers?: IncomingHeaders) {
  return apiGetAccount(resolveClient(headers));
}
