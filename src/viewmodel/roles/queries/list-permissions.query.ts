import type { Permission } from '@model/common';
import { listPermissions as apiListPermissions } from '@model/metadata';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

/**
 * O catálogo de permissões que podem ser concedidas a um perfil.
 *
 * Devolve só os slugs: o `id` do catálogo é um handle de consulta do backend,
 * não uma chave estável, então não atravessa o `PageInput`.
 *
 * Sem paginação, e sem laço para juntar páginas — o envelope não tem cursor
 * porque o catálogo é limitado pela quantidade de código do backend.
 *
 * @param headers Cabeçalhos do request no SSR; omitir no navegador.
 */
export async function listPermissions(headers?: IncomingHeaders): Promise<readonly Permission[]> {
  const { data } = await apiListPermissions(resolveClient(headers));
  return data.map((item) => item.slug);
}
