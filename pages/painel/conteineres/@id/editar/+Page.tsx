import { ContainerEditScreen } from '@view/containers/screens/ContainerEditScreen';
import { createContainerEditVM, type ContainerEditPageInput } from '@viewmodel/containers/container-edit-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/** Único ponto de composição da rota. */
export default function Page(): JSX.Element {
  const input = useData<ContainerEditPageInput>();
  return <ContainerEditScreen vm={createContainerEditVM(input)} />;
}
