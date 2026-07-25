// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================
import type { UserAdmin } from '@model/users';

import { userEditMessages, type UserEditText } from './i18n/user-edit-page.messages';
import { getUser } from './queries/get-user.query';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';
import { listRoles } from '../roles/queries/list-roles.query';

/** Dados que a rota entrega à View. */
export interface UserEditPageData {
  id: string;
  user: UserAdmin;
  roles: { id: string; name: string }[];
  t: UserEditText;
  title: string;
  description: string;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadUserEditPage(request: PageRequest): Promise<UserEditPageData> {
  const id = request.routeParams.id;
  const headers = request.headers;
  const t = userEditMessages(resolveLocale(headers));
  const [user, roles] = await Promise.all([getUser(id, headers), listRoles(headers)]);
  return {
    id,
    user,
    roles: roles.data.map((r) => ({ id: r.id, name: r.name })),
    t,
    title: `${t.edit} ${user.name}`,
    description: t.subtitle,
  };
}
