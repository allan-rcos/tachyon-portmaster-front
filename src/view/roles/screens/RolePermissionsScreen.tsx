import { AsyncBoundary } from '@view/core/components/AsyncBoundary';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { FormSkeleton } from '@view/core/components/Skeleton';
import { createScreenBinding } from '@view/core/screens/createScreenBinding';
import { RoleForm } from '@view/roles/islands/RoleForm.island';
import type { RolePermissionsVM } from '@viewmodel/roles/role-permissions-page.vm';
import type { JSX } from 'solid-js';

/**
 * Tela de sincronização de permissões de um perfil.
 *
 * @param props.vm ViewModel da rota.
 */
export function RolePermissionsScreen(props: { vm: RolePermissionsVM }): JSX.Element {
  const { data, status } = createScreenBinding(props.vm.role, props.vm.load);

  return (
    <AsyncBoundary
      status={status()}
      data={data()}
      fallback={<FormSkeleton rows={4} />}
      errorMessage={props.vm.boundary.loadError}
      retryLabel={props.vm.boundary.retry}
      onRetry={() => void props.vm.load()}
    >
      {(role) => (
        <section>
          <Breadcrumbs
            items={[{ label: props.vm.t.title, href: '/painel/perfis' }, { label: role.name }]}
          />
          <PageHeader title={role.name} subtitle={props.vm.t.syncPermissions} />
          <RoleForm
            mode="permissions"
            roleId={props.vm.id}
            defaultName={role.name}
            defaultPermissions={role.permissions}
            t={props.vm.t}
          />
        </section>
      )}
    </AsyncBoundary>
  );
}
