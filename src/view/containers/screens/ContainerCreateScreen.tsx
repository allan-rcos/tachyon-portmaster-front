import { ContainerList } from '@view/containers/components/ContainerList';
import { ContainerForm } from '@view/containers/islands/ContainerForm.island';
import { RouteModal } from '@view/core/islands/RouteModal.island';
import type { ContainerCreateVM } from '@viewmodel/containers/container-create-page.vm';
import type { ContainerListVM } from '@viewmodel/containers/container-list-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela de registro de contêiner. */
export interface ContainerCreateScreenProps {
  /** ViewModel do formulário. */
  vm: ContainerCreateVM;
  /** ViewModel da listagem que fica atrás do modal. */
  list: ContainerListVM;
}

/**
 * Registro de contêiner — modal sobre o pátio, como no protótipo.
 *
 * @param props.vm   ViewModel do formulário.
 * @param props.list ViewModel da listagem de fundo.
 */
export function ContainerCreateScreen(props: ContainerCreateScreenProps): JSX.Element {
  return (
    <>
      <ContainerList vm={props.list} />
      <RouteModal
        eyebrow={props.list.t.eyebrow}
        title={props.vm.t.new}
        icon="container"
        tint="teal"
        closeHref={props.vm.listHref}
        closeLabel={props.vm.t.close}
      >
        <ContainerForm vm={props.vm} />
      </RouteModal>
    </>
  );
}
