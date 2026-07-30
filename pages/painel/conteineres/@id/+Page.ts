/**
 * Composição de `/painel/conteineres/@id` — Detalhe do contêiner: manifesto, telemetria e as ações de ciclo de vida.
 *
 * Único ponto onde View e ViewModel se encontram para esta rota: constrói o VM a
 * partir do `pageContext.data` e devolve a tela. Sem markup, sem CSS, sem lógica.
 *
 * @packageDocumentation
 */
import { ContainerDetailScreen } from '@view/containers/screens/ContainerDetailScreen';
import {
  createContainerDetailVM,
  type ContainerDetailPageInput,
} from '@viewmodel/containers/container-detail-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createContainerDetailVM(pageContext.data as ContainerDetailPageInput);
  return () => ContainerDetailScreen({ vm });
}
