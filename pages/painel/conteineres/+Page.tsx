import { ContainerListScreen } from '@view/containers/screens/ContainerListScreen';
import { createContainerListVM } from '@viewmodel/containers/container-list-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createContainerListVM({ url: pageContext.urlOriginal });
  return (
    <ClientOnly fallback={<div />}>
      <ContainerListScreen vm={vm} />
    </ClientOnly>
  );
}
