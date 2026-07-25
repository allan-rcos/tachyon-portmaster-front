// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================
import type { Role } from '@model/roles';

import { rolePermissionsMessages, type RolePermissionsText } from './i18n/role-permissions-page.messages';
import { listRoles } from './queries/list-roles.query';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';
import { PageNotFoundError } from '../core/page/page-request';

/** Dados que a rota entrega à View. */
export interface RolePermissionsPageData {
  id: string;
  role: Role;
  t: RolePermissionsText;
  title: string;
  description: string;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadRolePermissionsPage(request: PageRequest): Promise<RolePermissionsPageData> {
  const id = request.routeParams.id;
  const headers = request.headers;
  const t = rolePermissionsMessages(resolveLocale(headers));

  // Não há GET /roles/{id} — busca na listagem (poucos perfis).
  const res = await listRoles(headers);
  const role = res.data.find((r) => r.id === id);
  if (!role) throw new PageNotFoundError();

  return { id, role, t, title: `${t.syncPermissions} — ${role.name}`, description: t.subtitle };
}
