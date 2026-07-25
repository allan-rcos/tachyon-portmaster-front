import { DashboardScreen } from '@view/metrics/screens/DashboardScreen';
import { createDashboardVM } from '@viewmodel/metrics/dashboard-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createDashboardVM({ url: pageContext.urlOriginal });
  return (
    <ClientOnly fallback={<div />}>
      <DashboardScreen vm={vm} />
    </ClientOnly>
  );
}
