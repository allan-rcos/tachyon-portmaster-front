import { RoleListScreen } from '@view/roles/screens/RoleListScreen';
import { createRoleListVM, type RoleListPageInput } from '@viewmodel/roles/role-list-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/** Único ponto de composição da rota. */
export default function Page(): JSX.Element {
  const input = useData<RoleListPageInput>();
  return <RoleListScreen vm={createRoleListVM(input)} />;
}
