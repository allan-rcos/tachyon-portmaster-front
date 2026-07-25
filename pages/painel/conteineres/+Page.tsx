import { ContainerList } from '@view/containers/components/ContainerList';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';


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
