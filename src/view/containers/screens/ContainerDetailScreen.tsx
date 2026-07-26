import { ContainerSummary } from '@view/containers/components/ContainerSummary';
import type { ContainerDetailVM } from '@viewmodel/containers/container-detail-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela de detalhe de contêiner. */
export interface ContainerDetailScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: ContainerDetailVM;
}

/**
 * Tela de detalhe do contêiner. Stateless: resumo, manifesto, telemetria e
 * catálogo já vieram resolvidos pelo `+data`.
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerDetailScreen(props: ContainerDetailScreenProps): JSX.Element {
  return <ContainerSummary vm={props.vm} />;
}
