import { RouteModal } from '@view/core/islands/RouteModal.island';
import { UserList } from '@view/users/components/UserList';
import { UserAdminActions } from '@view/users/islands/UserAdminActions.island';
import { UserForm } from '@view/users/islands/UserForm.island';
import type { UserEditVM } from '@viewmodel/users/user-edit-page.vm';
import type { UserListVM } from '@viewmodel/users/user-list-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela de edição de usuário. */
export interface UserEditScreenProps {
  /** ViewModel do formulário. */
  vm: UserEditVM;
  /** ViewModel da listagem que fica atrás do modal. */
  list: UserListVM;
}

/**
 * Edição de usuário — modal sobre a listagem, com as ações administrativas
 * (redefinir senha, excluir) DENTRO dele.
 *
 * O título é o nome do usuário: a linha correspondente fica coberta pelo modal,
 * então ele precisa dizer sobre quem é.
 *
 * @param props.vm   ViewModel do formulário.
 * @param props.list ViewModel da listagem de fundo.
 */
export function UserEditScreen(props: UserEditScreenProps): JSX.Element {
  return (
    <>
      <UserList vm={props.list} />
      <RouteModal
        eyebrow={props.list.t.eyebrow}
        title={props.vm.userName}
        icon="user"
        tint="gold"
        closeHref={props.vm.listHref}
        closeLabel={props.vm.t.close}
      >
        <UserForm vm={props.vm} />
        <UserAdminActions vm={props.vm} />
      </RouteModal>
    </>
  );
}
