// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================

import { userNewMessages, type UserNewText } from './i18n/user-create-page.messages';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';
import { listRoles } from '../roles/queries/list-roles.query';

/** Dados que a rota entrega à View. */
export interface UserCreatePageData {
  t: UserNewText;
  title: string;
  description: string;
  roles: { id: string; name: string }[];
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadUserCreatePage(request: PageRequest): Promise<UserCreatePageData> {
  const headers = request.headers;
  const t = userNewMessages(resolveLocale(headers));
  const roles = await listRoles(headers);
  return {
    t,
    title: t.new,
    description: t.subtitle,
    roles: roles.data.map((r) => ({ id: r.id, name: r.name })),
  };
}
