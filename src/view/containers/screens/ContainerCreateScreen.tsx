import { ContainerForm } from '@view/containers/islands/ContainerForm.island';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import type { ContainerCreateVM } from '@viewmodel/containers/container-create-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela de registro de contêiner. */
export interface ContainerCreateScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: ContainerCreateVM;
}

/**
 * Tela de registro de contêiner. Stateless: só o formulário.
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerCreateScreen(props: ContainerCreateScreenProps): JSX.Element {
  return (
    <section>
      <Breadcrumbs
        items={[{ label: props.vm.t.title, href: props.vm.listHref }, { label: props.vm.t.new }]}
      />
      <PageHeader title={props.vm.t.new} />
      <ContainerForm vm={props.vm} />
    </section>
  );
}
