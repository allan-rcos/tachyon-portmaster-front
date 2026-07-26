import { RoleList } from '@view/roles/components/RoleList';
import type { RoleListVM } from '@viewmodel/roles/role-list-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela de listagem de perfis. */
export interface RoleListScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: RoleListVM;
}

/**
 * Tela da listagem de perfis (RBAC). Stateless: a primeira página já veio
 * pronta pelo `+data`.
 *
 * @param props.vm ViewModel da rota.
 */
export function RoleListScreen(props: RoleListScreenProps): JSX.Element {
  return <RoleList vm={props.vm} />;
}
