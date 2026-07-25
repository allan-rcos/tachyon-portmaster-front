import { AsyncBoundary } from '@view/core/components/AsyncBoundary';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { Skeleton } from '@view/core/components/Skeleton';
import { createScreenBinding } from '@view/core/screens/createScreenBinding';
import { MetricsPanel } from '@view/metrics/components/MetricsPanel';
import type { DashboardVM } from '@viewmodel/metrics/dashboard-page.vm';
import type { JSX } from 'solid-js';

/**
 * Tela do painel operacional.
 *
 * @param props.vm ViewModel da rota.
 */
export function DashboardScreen(props: { vm: DashboardVM }): JSX.Element {
  const { data, status } = createScreenBinding(props.vm.metrics, props.vm.load);

  return (
    <>
      <Breadcrumbs items={[{ label: props.vm.t.title }]} />
      <PageHeader title={props.vm.t.title} subtitle={props.vm.t.subtitle} />
      <AsyncBoundary
        status={status()}
        data={data()}
        fallback={<Skeleton height="20rem" />}
        errorMessage={props.vm.boundary.loadError}
        retryLabel={props.vm.boundary.retry}
        onRetry={() => void props.vm.load()}
      >
        {(metrics) => <MetricsPanel metrics={metrics} t={props.vm.t} />}
      </AsyncBoundary>
    </>
  );
}
