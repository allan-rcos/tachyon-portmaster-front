/**
 * Composição de `/painel/conteineres` — Listagem de contêineres, paginada por cursor.
 *
 * Único ponto onde View e ViewModel se encontram para esta rota: constrói o VM a
 * partir do `pageContext.data` e devolve a tela. Sem markup, sem CSS, sem lógica.
 *
 * @packageDocumentation
 */
import { ContainerListScreen } from '@view/containers/screens/ContainerListScreen';
import {
  createContainerListVM,
  type ContainerListPageInput,
} from '@viewmodel/containers/container-list-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createContainerListVM(pageContext.data as ContainerListPageInput);
  return () => ContainerListScreen({ vm });
}
