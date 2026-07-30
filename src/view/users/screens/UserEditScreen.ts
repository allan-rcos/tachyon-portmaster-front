import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { UserAdminActions } from '@view/users/islands/UserAdminActions.island';
import { UserForm } from '@view/users/islands/UserForm.island';
import type { UserEditVM } from '@viewmodel/users/user-edit-page.vm';
import { html, type TemplateResult } from 'lit';

/** Props da tela de edição de usuário. */
export interface UserEditScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: UserEditVM;
}

/**
 * Tela de edição de usuário, com as ações administrativas ao lado. Stateless.
 *
 * O mesmo `vm` atende as duas metades: o formulário lê `value`/`error`/`submit`,
 * as ações leem `newPassword`/`resetPassword`/`remove`. Cada uma declara o que
 * precisa, e o VM da rota satisfaz as duas.
 *
 * @param props.vm ViewModel da rota.
 */
export function UserEditScreen(props: UserEditScreenProps): TemplateResult {
  const { vm } = props;

  return html`<section>
    ${Breadcrumbs({ items: [{ label: vm.t.title, href: vm.listHref }, { label: vm.userName }] })}
    ${PageHeader({ title: `${vm.t.edit} — ${vm.userName}` })} ${UserForm({ vm })}
    ${UserAdminActions({ vm })}
  </section>`;
}
