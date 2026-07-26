import { ContainerDetailScreen } from '@view/containers/screens/ContainerDetailScreen';
import { createContainerDetailVM, type ContainerDetailPageInput } from '@viewmodel/containers/container-detail-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/** Único ponto de composição da rota. */
export default function Page(): JSX.Element {
  const input = useData<ContainerDetailPageInput>();
  return <ContainerDetailScreen vm={createContainerDetailVM(input)} />;
}
