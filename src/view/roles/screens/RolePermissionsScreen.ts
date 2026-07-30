import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { RoleForm } from '@view/roles/islands/RoleForm.island';
import type { RolePermissionsVM } from '@viewmodel/roles/role-permissions-page.vm';
import { html, type TemplateResult } from 'lit';

/** Props da tela de permissões de um perfil. */
export interface RolePermissionsScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: RolePermissionsVM;
}

/**
 * Tela de sincronização de permissões de um perfil. Stateless: o perfil já veio
 * resolvido pelo `+data`, então a matriz chega marcada no HTML da 1ª requisição.
 *
 * @param props.vm ViewModel da rota.
 */
export function RolePermissionsScreen(props: RolePermissionsScreenProps): TemplateResult {
  const { vm } = props;

  return html`<section>
    ${Breadcrumbs({ items: [{ label: vm.t.title, href: vm.listHref }, { label: vm.roleName }] })}
    ${PageHeader({ title: vm.roleName, subtitle: vm.t.syncPermissions })} ${RoleForm({ vm })}
  </section>`;
}
