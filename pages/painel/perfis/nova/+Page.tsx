import { RoleCreateScreen } from '@view/roles/screens/RoleCreateScreen';
import { createRoleCreateVM, type RoleCreatePageInput } from '@viewmodel/roles/role-create-page.vm';
import { createRoleListVM } from '@viewmodel/roles/role-list-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/** Único ponto de composição da rota. */
export default function Page(): JSX.Element {
  const input = useData<RoleCreatePageInput>();
  return (
    <RoleCreateScreen vm={createRoleCreateVM(input)} list={createRoleListVM(input.background)} />
  );
}
