import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { UserAdminActions } from '@view/users/islands/UserAdminActions.island';
import { UserForm } from '@view/users/islands/UserForm.island';
import type { UserEditVM } from '@viewmodel/users/user-edit-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela de edição de usuário. */
export interface UserEditScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: UserEditVM;
}

/**
 * Tela de edição de usuário, com as ações administrativas ao lado. Stateless.
 *
 * @param props.vm ViewModel da rota.
 */
export function UserEditScreen(props: UserEditScreenProps): JSX.Element {
  return (
    <section>
      <Breadcrumbs
        items={[{ label: props.vm.t.title, href: props.vm.listHref }, { label: props.vm.userName }]}
      />
      <PageHeader title={`${props.vm.t.edit} — ${props.vm.userName}`} />
      <UserForm vm={props.vm} />
      <UserAdminActions vm={props.vm} />
    </section>
  );
}
