import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { UserForm } from '@view/users/islands/UserForm.island';
import type { UserCreateVM } from '@viewmodel/users/user-create-page.vm';
import { html, type TemplateResult } from 'lit';

/** Props da tela de criação de usuário. */
export interface UserCreateScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: UserCreateVM;
}

/**
 * Tela de criação de usuário. Stateless: os perfis já vieram pelo `+data`, e
 * com eles as caixas de seleção chegam no HTML da primeira requisição.
 *
 * @param props.vm ViewModel da rota.
 */
export function UserCreateScreen(props: UserCreateScreenProps): TemplateResult {
  const { vm } = props;

  return html`<section>
    ${Breadcrumbs({ items: [{ label: vm.t.title, href: vm.listHref }, { label: vm.t.new }] })}
    ${PageHeader({ title: vm.t.new })} ${UserForm({ vm })}
  </section>`;
}
