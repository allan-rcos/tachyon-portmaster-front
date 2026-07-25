import { ContainerSummary } from '@view/containers/components/ContainerSummary';
import { AsyncBoundary } from '@view/core/components/AsyncBoundary';
import { Skeleton } from '@view/core/components/Skeleton';
import { createScreenBinding } from '@view/core/screens/createScreenBinding';
import type { ContainerDetailVM } from '@viewmodel/containers/container-detail-page.vm';
import type { JSX } from 'solid-js';

/**
 * Tela de detalhe do contêiner: resumo, manifesto, telemetria e ações.
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerDetailScreen(props: { vm: ContainerDetailVM }): JSX.Element {
  const { data, status } = createScreenBinding(props.vm.data, props.vm.load);

  return (
    <AsyncBoundary
      status={status()}
      data={data()}
      fallback={<Skeleton height="26rem" />}
      errorMessage={props.vm.boundary.loadError}
      retryLabel={props.vm.boundary.retry}
      onRetry={() => void props.vm.load()}
    >
      {(detail) => (
        <ContainerSummary summary={detail.summary} products={detail.products} t={props.vm.t} />
      )}
    </AsyncBoundary>
  );
}
