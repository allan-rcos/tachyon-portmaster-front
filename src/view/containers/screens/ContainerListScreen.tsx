import { ContainerList } from '@view/containers/components/ContainerList';
import { AsyncBoundary } from '@view/core/components/AsyncBoundary';
import { Skeleton } from '@view/core/components/Skeleton';
import { createScreenBinding } from '@view/core/screens/createScreenBinding';
import type { ContainerListVM } from '@viewmodel/containers/container-list-page.vm';
import type { JSX } from 'solid-js';

/**
 * Tela da listagem de contêineres, com filtros e paginação por cursor.
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerListScreen(props: { vm: ContainerListVM }): JSX.Element {
  const { data, status } = createScreenBinding(props.vm.containers, props.vm.load);

  return (
    <AsyncBoundary
      status={status()}
      data={data()}
      fallback={<Skeleton height="22rem" />}
      errorMessage={props.vm.boundary.loadError}
      retryLabel={props.vm.boundary.retry}
      onRetry={() => void props.vm.load()}
    >
      {(page) => (
        <ContainerList
          items={page.data}
          total={page.total}
          nextCursor={page.next_cursor}
          filters={props.vm.filters}
          t={props.vm.t}
        />
      )}
    </AsyncBoundary>
  );
}
