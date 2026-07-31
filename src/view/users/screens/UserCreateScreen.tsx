import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { UserForm } from '@view/users/islands/UserForm.island';
import type { UserCreateVM } from '@viewmodel/users/user-create-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela de criação de usuário. */
export interface UserCreateScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: UserCreateVM;
}

/**
 * Tela de criação de usuário. Stateless: os perfis já vieram pelo `+data`, e
 * com eles o `<select>` chega populado no HTML da primeira requisição.
 *
 * @param props.vm ViewModel da rota.
 */
export function UserCreateScreen(props: UserCreateScreenProps): JSX.Element {
  return (
    <section>
      <Breadcrumbs
        items={[{ label: props.vm.t.title, href: props.vm.listHref }, { label: props.vm.t.new }]}
      />
      <PageHeader title={props.vm.t.new} />
      <UserForm vm={props.vm} />
    </section>
  );
}
