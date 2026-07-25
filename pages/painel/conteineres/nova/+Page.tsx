import { ContainerCreateScreen } from '@view/containers/screens/ContainerCreateScreen';
import { createContainerCreateVM } from '@viewmodel/containers/container-create-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createContainerCreateVM({ url: pageContext.urlOriginal });
  return (
    <ClientOnly fallback={<div />}>
      <ContainerCreateScreen vm={vm} />
    </ClientOnly>
  );
}
