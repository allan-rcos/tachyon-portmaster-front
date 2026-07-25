import { ContainerEditScreen } from '@view/containers/screens/ContainerEditScreen';
import { createContainerEditVM } from '@viewmodel/containers/container-edit-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createContainerEditVM({
    url: pageContext.urlOriginal,
    routeParams: pageContext.routeParams,
  });
  return (
    <ClientOnly fallback={<div />}>
      <ContainerEditScreen vm={vm} />
    </ClientOnly>
  );
}
