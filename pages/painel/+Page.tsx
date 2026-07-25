

import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { MetricsPanel } from '@view/metrics/components/MetricsPanel';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

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
