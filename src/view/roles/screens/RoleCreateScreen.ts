import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { RoleForm } from '@view/roles/islands/RoleForm.island';
import type { RoleCreateVM } from '@viewmodel/roles/role-create-page.vm';
import { html, type TemplateResult } from 'lit';

/** Props da tela de criação de perfil. */
export interface RoleCreateScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: RoleCreateVM;
}

/**
 * Tela de criação de perfil, com a matriz de permissões. Stateless.
 *
 * @param props.vm ViewModel da rota.
 */
export function RoleCreateScreen(props: RoleCreateScreenProps): TemplateResult {
  const { vm } = props;

  return html`<section>
    ${Breadcrumbs({ items: [{ label: vm.t.title, href: vm.listHref }, { label: vm.t.new }] })}
    ${PageHeader({ title: vm.t.new, subtitle: vm.t.subtitle })} ${RoleForm({ vm })}
  </section>`;
}
