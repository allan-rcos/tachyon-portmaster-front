import { ContainerListScreen } from '@view/containers/screens/ContainerListScreen';
import { createContainerListVM, type ContainerListPageInput } from '@viewmodel/containers/container-list-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/** Único ponto de composição da rota. */
export default function Page(): JSX.Element {
  const input = useData<ContainerListPageInput>();
  return <ContainerListScreen vm={createContainerListVM(input)} />;
}
