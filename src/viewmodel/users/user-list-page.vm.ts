// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================
import type { UserAdmin } from '@model/users';

import type { UserListText } from './i18n/text-contracts';
import { usersListMessages } from './i18n/user-list-page.messages';
import { listUsers } from './queries/list-users.query';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';
import { searchParams } from '../core/page/page-request';

/** Dados que a rota entrega à View. */
export interface UserListPageData {
  items: UserAdmin[];
  total: number;
  t: UserListText;
  title: string;
  description: string;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadUserListPage(request: PageRequest): Promise<UserListPageData> {
  const headers = request.headers;
  const t = usersListMessages(resolveLocale(headers));
  const query = searchParams(request);
  const res = await listUsers(headers, query);
  return { items: res.data, total: res.total, t, title: t.title, description: t.subtitle };
}
