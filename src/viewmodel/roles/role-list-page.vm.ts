// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================
import type { Role } from '@model/roles';

import { rolesListMessages } from './i18n/role-list-page.messages';
import type { RoleListText } from './i18n/text-contracts';
import { listRoles } from './queries/list-roles.query';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';

/** Dados que a rota entrega à View. */
export interface RoleListPageData {
  items: Role[];
  total: number;
  t: RoleListText;
  title: string;
  description: string;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadRoleListPage(request: PageRequest): Promise<RoleListPageData> {
  const headers = request.headers;
  const t = rolesListMessages(resolveLocale(headers));
  const res = await listRoles(headers);
  return { items: res.data, total: res.total, t, title: t.title, description: t.subtitle };
}
