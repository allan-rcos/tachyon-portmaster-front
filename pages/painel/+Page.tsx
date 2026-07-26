import { DashboardScreen } from '@view/metrics/screens/DashboardScreen';
import { createDashboardVM, type DashboardPageInput } from '@viewmodel/metrics/dashboard-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/** Único ponto de composição da rota. */
export default function Page(): JSX.Element {
  const input = useData<DashboardPageInput>();
  return <DashboardScreen vm={createDashboardVM(input)} />;
}
