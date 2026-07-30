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
