import { ContainerCreateScreen } from '@view/containers/screens/ContainerCreateScreen';
import {
  createContainerCreateVM,
  type ContainerCreatePageInput,
} from '@viewmodel/containers/container-create-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createContainerCreateVM(pageContext.data as ContainerCreatePageInput);
  return () => ContainerCreateScreen({ vm });
}
