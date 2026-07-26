import { RolePermissionsScreen } from '@view/roles/screens/RolePermissionsScreen';
import { createRolePermissionsVM, type RolePermissionsPageInput } from '@viewmodel/roles/role-permissions-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/** Único ponto de composição da rota. */
export default function Page(): JSX.Element {
  const input = useData<RolePermissionsPageInput>();
  return <RolePermissionsScreen vm={createRolePermissionsVM(input)} />;
}
