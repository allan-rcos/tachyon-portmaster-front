import { UserList } from '@view/users/components/UserList';
import type { UserListVM } from '@viewmodel/users/user-list-page.vm';
import type { TemplateResult } from 'lit';

/** Props da tela de listagem de usuários. */
export interface UserListScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: UserListVM;
}

/**
 * Tela da listagem de usuários. Stateless: a primeira página já veio pronta
 * pelo `+data`, então não há carga inicial a tratar.
 *
 * @param props.vm ViewModel da rota.
 */
export function UserListScreen(props: UserListScreenProps): TemplateResult {
  return UserList({ vm: props.vm });
}
