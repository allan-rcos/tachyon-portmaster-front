/**
 * Composição de `/painel/conteineres/@id/editar` — Edição de contêiner.
 *
 * Único ponto onde View e ViewModel se encontram para esta rota: constrói o VM a
 * partir do `pageContext.data` e devolve a tela. Sem markup, sem CSS, sem lógica.
 *
 * @packageDocumentation
 */
import { ContainerEditScreen } from '@view/containers/screens/ContainerEditScreen';
import {
  createContainerEditVM,
  type ContainerEditPageInput,
} from '@viewmodel/containers/container-edit-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createContainerEditVM(pageContext.data as ContainerEditPageInput);
  return () => ContainerEditScreen({ vm });
}
