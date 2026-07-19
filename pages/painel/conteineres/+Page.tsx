import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

import { ContainerList } from '@/features/containers/components/ContainerList';

export default function ContainersPage() {
  const data = useData<Data>();
  return (
    <ContainerList
      items={data.items}
      total={data.total}
      nextCursor={data.nextCursor}
      filters={data.filters}
      t={data.t}
    />
  );
}
