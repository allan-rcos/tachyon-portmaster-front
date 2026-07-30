import { ContainerList } from '@view/containers/components/ContainerList';
import type { ContainerListVM } from '@viewmodel/containers/container-list-page.vm';
import type { TemplateResult } from 'lit';

/** Props da tela de listagem de contêineres. */
export interface ContainerListScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: ContainerListVM;
}

/**
 * Tela da listagem de contêineres. Stateless: a primeira página já veio pronta
 * pelo `+data`.
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerListScreen(props: ContainerListScreenProps): TemplateResult {
  return ContainerList({ vm: props.vm });
}
