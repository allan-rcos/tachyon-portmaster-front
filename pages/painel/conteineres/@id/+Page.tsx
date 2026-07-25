import { ContainerSummary } from '@view/containers/components/ContainerSummary';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';


export default function ContainerDetailPage() {
  const data = useData<Data>();
  return <ContainerSummary summary={data.summary} products={data.products} t={data.t} />;
}
