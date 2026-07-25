// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================

import { roleNewMessages, type RoleNewText } from './i18n/role-create-page.messages';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';

/** Dados que a rota entrega à View. */
export interface RoleCreatePageData {
  t: RoleNewText;
  title: string;
  description: string;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadRoleCreatePage(request: PageRequest): Promise<RoleCreatePageData> {
  const t = roleNewMessages(resolveLocale(request.headers));
  return { t, title: t.new, description: t.subtitle };
}
