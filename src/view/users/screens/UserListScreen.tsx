import { AsyncBoundary } from '@view/core/components/AsyncBoundary';
import { Skeleton } from '@view/core/components/Skeleton';
import { createScreenBinding } from '@view/core/screens/createScreenBinding';
import { UserList } from '@view/users/components/UserList';
import type { UserListVM } from '@viewmodel/users/user-list-page.vm';
import type { JSX } from 'solid-js';

/**
 * Tela da listagem de usuários.
 *
 * @param props.vm ViewModel da rota.
 */
export function UserListScreen(props: { vm: UserListVM }): JSX.Element {
  const { data, status } = createScreenBinding(props.vm.users, props.vm.load);

  return (
    <AsyncBoundary
      status={status()}
      data={data()}
      fallback={<Skeleton height="18rem" />}
      errorMessage={props.vm.boundary.loadError}
      retryLabel={props.vm.boundary.retry}
      onRetry={() => void props.vm.load()}
    >
      {(page) => <UserList items={page.data} total={page.total} t={props.vm.t} />}
    </AsyncBoundary>
  );
}
