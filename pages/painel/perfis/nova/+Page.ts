import { RoleCreateScreen } from '@view/roles/screens/RoleCreateScreen';
import { createRoleCreateVM, type RoleCreatePageInput } from '@viewmodel/roles/role-create-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createRoleCreateVM(pageContext.data as RoleCreatePageInput);
  return () => RoleCreateScreen({ vm });
}
