import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { RoleForm } from '@view/roles/islands/RoleForm.island';
import type { RolePermissionsVM } from '@viewmodel/roles/role-permissions-page.vm';
import type { JSX } from 'solid-js';

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
export function RolePermissionsScreen(props: RolePermissionsScreenProps): JSX.Element {
  return (
    <section>
      <Breadcrumbs
        items={[{ label: props.vm.t.title, href: props.vm.listHref }, { label: props.vm.roleName }]}
      />
      <PageHeader title={props.vm.roleName} subtitle={props.vm.t.syncPermissions} />
      <RoleForm vm={props.vm} />
    </section>
  );
}
