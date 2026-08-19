import { ContainerList } from '@view/containers/components/ContainerList';
import { ContainerForm } from '@view/containers/islands/ContainerForm.island';
import { RouteModal } from '@view/core/islands/RouteModal.island';
import type { ContainerEditVM } from '@viewmodel/containers/container-edit-page.vm';
import type { ContainerListVM } from '@viewmodel/containers/container-list-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela de edição de contêiner. */
export interface ContainerEditScreenProps {
  /** ViewModel do formulário. */
  vm: ContainerEditVM;
  /** ViewModel da listagem que fica atrás do modal. */
  list: ContainerListVM;
}

/**
 * Edição de contêiner (capacidade máxima) — modal sobre o pátio.
 *
 * O título é o código do contêiner, que é como o pátio o identifica.
 *
 * @param props.vm   ViewModel do formulário.
 * @param props.list ViewModel da listagem de fundo.
 */
export function ContainerEditScreen(props: ContainerEditScreenProps): JSX.Element {
  return (
    <>
      <ContainerList vm={props.list} />
      <RouteModal
        eyebrow={props.list.t.eyebrow}
        title={props.vm.code}
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
