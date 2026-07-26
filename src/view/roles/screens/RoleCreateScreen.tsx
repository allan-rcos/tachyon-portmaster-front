import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { RoleForm } from '@view/roles/islands/RoleForm.island';
import type { RoleCreateVM } from '@viewmodel/roles/role-create-page.vm';
import type { JSX } from 'solid-js';

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
export function RoleCreateScreen(props: RoleCreateScreenProps): JSX.Element {
  return (
    <section>
      <Breadcrumbs
        items={[{ label: props.vm.t.title, href: props.vm.listHref }, { label: props.vm.t.new }]}
      />
      <PageHeader title={props.vm.t.new} subtitle={props.vm.t.subtitle} />
      <RoleForm mode="create" t={props.vm.t} permissionGroups={props.vm.permissionGroups} />
    </section>
  );
}
