import { listUsers as apiListUsers } from '@model/users';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

/** Tamanho de página pedido — também é o limiar de "talvez haja mais". */
export const USERS_PAGE_SIZE = 50;

/**
 * Lista os usuários com seus perfis.
 *
 * `/users` é a ÚNICA listagem paginada por `page`/`limit`: as outras usam
 * cursor. O envelope `UserListResponse` não traz `next_cursor` nem `total`, e
 * inventar um cursor aqui só produziria um parâmetro que o backend ignora.
 *
 * @param headers Cabeçalhos do request no SSR; omitir no navegador.
 * @param page    Página pedida, começando em 1.
 */
export function listUsers(headers?: IncomingHeaders, page = 1) {
  return apiListUsers(resolveClient(headers), {
    page: String(page),
    limit: String(USERS_PAGE_SIZE),
  });
}
