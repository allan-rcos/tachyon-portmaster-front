import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

import { ContainerSummary } from '@/features/containers/components/ContainerSummary';

export default function ContainerDetailPage() {
  const data = useData<Data>();
  return <ContainerSummary summary={data.summary} products={data.products} t={data.t} />;
}
