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
