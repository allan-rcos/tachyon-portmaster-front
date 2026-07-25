import { ContainerDetailScreen } from '@view/containers/screens/ContainerDetailScreen';
import { createContainerDetailVM } from '@viewmodel/containers/container-detail-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createContainerDetailVM({ url: pageContext.urlOriginal, routeParams: pageContext.routeParams });
  return (
    <ClientOnly fallback={<div />}>
      <ContainerDetailScreen vm={vm} />
    </ClientOnly>
  );
}
