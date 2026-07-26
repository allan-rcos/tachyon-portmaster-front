import { ContainerForm } from '@view/containers/islands/ContainerForm.island';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import type { ContainerEditVM } from '@viewmodel/containers/container-edit-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela de edição de contêiner. */
export interface ContainerEditScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: ContainerEditVM;
}

/**
 * Tela de edição de contêiner (capacidade máxima). Stateless: o contêiner já
 * veio resolvido pelo `+data`.
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerEditScreen(props: ContainerEditScreenProps): JSX.Element {
  return (
    <section>
      <Breadcrumbs
        items={[{ label: props.vm.t.title, href: props.vm.listHref }, { label: props.vm.code }]}
      />
      <PageHeader title={`${props.vm.t.edit} — ${props.vm.code}`} />
      <ContainerForm
        mode="edit"
        containerId={props.vm.id}
        defaultValues={props.vm.values}
        t={props.vm.t}
      />
    </section>
  );
}
