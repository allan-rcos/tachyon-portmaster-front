import { ContainerForm } from '@view/containers/islands/ContainerForm.island';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { FormSkeleton } from '@view/core/components/Skeleton';
import type { ContainerCreateVM } from '@viewmodel/containers/container-create-page.vm';
import type { JSX } from 'solid-js';
import { ClientOnly } from 'vike-solid/ClientOnly';

/**
 * Tela de registro de contêiner. Sem carga assíncrona: só o formulário.
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerCreateScreen(props: { vm: ContainerCreateVM }): JSX.Element {
  return (
    <section>
      <Breadcrumbs
        items={[
          { label: props.vm.t.title, href: '/painel/conteineres' },
          { label: props.vm.t.new },
        ]}
      />
      <PageHeader title={props.vm.t.new} />
      <ClientOnly fallback={<FormSkeleton rows={2} />}>
        <ContainerForm mode="create" t={props.vm.t} />
      </ClientOnly>
    </section>
  );
}
