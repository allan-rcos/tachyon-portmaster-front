import { AsyncBoundary } from '@view/core/components/AsyncBoundary';
import { Skeleton } from '@view/core/components/Skeleton';
import { createScreenBinding } from '@view/core/screens/createScreenBinding';
import { RoleList } from '@view/roles/components/RoleList';
import type { RoleListVM } from '@viewmodel/roles/role-list-page.vm';
import type { JSX } from 'solid-js';

/**
 * Tela da listagem de perfis (RBAC).
 *
 * @param props.vm ViewModel da rota.
 */
export function RoleListScreen(props: { vm: RoleListVM }): JSX.Element {
  const { data, status } = createScreenBinding(props.vm.roles, props.vm.load);

  return (
    <AsyncBoundary
      status={status()}
      data={data()}
      fallback={<Skeleton height="18rem" />}
      errorMessage={props.vm.boundary.loadError}
      retryLabel={props.vm.boundary.retry}
      onRetry={() => void props.vm.load()}
    >
      {(page) => <RoleList items={page.data} total={page.total} t={props.vm.t} />}
    </AsyncBoundary>
  );
}
