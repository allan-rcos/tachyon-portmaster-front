import { ContainerCreateScreen } from '@view/containers/screens/ContainerCreateScreen';
import { createContainerCreateVM, type ContainerCreatePageInput } from '@viewmodel/containers/container-create-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/** Único ponto de composição da rota. */
export default function Page(): JSX.Element {
  const input = useData<ContainerCreatePageInput>();
  return <ContainerCreateScreen vm={createContainerCreateVM(input)} />;
}
