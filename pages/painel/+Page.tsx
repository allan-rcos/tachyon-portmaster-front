import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

import { Breadcrumbs } from '@/features/core/components/Breadcrumbs';
import { PageHeader } from '@/features/core/components/PageHeader';
import { MetricsPanel } from '@/features/metrics/components/MetricsPanel';

export default function PainelPage() {
  const data = useData<Data>();
  return (
    <>
      <Breadcrumbs items={[{ label: data.t.title }]} />
      <PageHeader title={data.t.title} subtitle={data.t.subtitle} />
      <MetricsPanel metrics={data.metrics} t={data.t} />
    </>
  );
}
