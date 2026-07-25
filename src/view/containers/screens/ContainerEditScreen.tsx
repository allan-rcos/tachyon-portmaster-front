import { ContainerForm } from '@view/containers/islands/ContainerForm.island';
import { AsyncBoundary } from '@view/core/components/AsyncBoundary';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { FormSkeleton } from '@view/core/components/Skeleton';
import { createScreenBinding } from '@view/core/screens/createScreenBinding';
import type { ContainerEditVM } from '@viewmodel/containers/container-edit-page.vm';
import type { JSX } from 'solid-js';

/**
 * Tela de edição de contêiner (capacidade máxima).
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerEditScreen(props: { vm: ContainerEditVM }): JSX.Element {
  const { data, status } = createScreenBinding(props.vm.container, props.vm.load);

  return (
    <AsyncBoundary
      status={status()}
      data={data()}
      fallback={<FormSkeleton rows={1} />}
      errorMessage={props.vm.boundary.loadError}
      retryLabel={props.vm.boundary.retry}
      onRetry={() => void props.vm.load()}
    >
      {(container) => (
        <section>
          <Breadcrumbs
            items={[
              { label: props.vm.t.title, href: '/painel/conteineres' },
              { label: container.code, href: `/painel/conteineres/${props.vm.id}` },
              { label: props.vm.t.edit },
            ]}
          />
          <PageHeader title={`${props.vm.t.edit} — ${container.code}`} />
          <ContainerForm
            mode="edit"
            containerId={props.vm.id}
            defaultValues={{ code: container.code, max_capacity: container.max_capacity }}
            t={props.vm.t}
          />
        </section>
      )}
    </AsyncBoundary>
  );
}
