import { RolePermissionsScreen } from '@view/roles/screens/RolePermissionsScreen';
import {
  createRolePermissionsVM,
  type RolePermissionsPageInput,
} from '@viewmodel/roles/role-permissions-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createRolePermissionsVM(pageContext.data as RolePermissionsPageInput);
  return () => RolePermissionsScreen({ vm });
}
