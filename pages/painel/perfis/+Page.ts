import { RoleListScreen } from '@view/roles/screens/RoleListScreen';
import { createRoleListVM, type RoleListPageInput } from '@viewmodel/roles/role-list-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createRoleListVM(pageContext.data as RoleListPageInput);
  return () => RoleListScreen({ vm });
}
