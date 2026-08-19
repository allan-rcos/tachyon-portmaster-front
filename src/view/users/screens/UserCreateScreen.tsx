import { RouteModal } from '@view/core/islands/RouteModal.island';
import { UserList } from '@view/users/components/UserList';
import { UserForm } from '@view/users/islands/UserForm.island';
import type { UserCreateVM } from '@viewmodel/users/user-create-page.vm';
import type { UserListVM } from '@viewmodel/users/user-list-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela de criação de usuário. */
export interface UserCreateScreenProps {
  /** ViewModel do formulário. */
  vm: UserCreateVM;
  /** ViewModel da listagem que fica atrás do modal. */
  list: UserListVM;
}

/**
 * Criação de usuário — modal sobre a listagem, como no protótipo.
 *
 * Os perfis já vieram pelo `+data`, então o `<select>` chega populado no HTML
 * da primeira requisição, dentro do modal. Ver `ProductCreateScreen` para o
 * porquê de a rota ter sido mantida.
 *
 * @param props.vm   ViewModel do formulário.
 * @param props.list ViewModel da listagem de fundo.
 */
export function UserCreateScreen(props: UserCreateScreenProps): JSX.Element {
  return (
    <>
      <UserList vm={props.list} />
      <RouteModal
        eyebrow={props.list.t.eyebrow}
        title={props.vm.t.new}
        icon="user"
        tint="gold"
        closeHref={props.vm.listHref}
        closeLabel={props.vm.t.close}
      >
        <UserForm vm={props.vm} />
      </RouteModal>
    </>
  );
}
