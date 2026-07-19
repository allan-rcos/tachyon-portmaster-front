import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

import { RoleList } from '@/features/roles/components/RoleList';

export default function RolesPage() {
  const data = useData<Data>();
  return <RoleList items={data.items} total={data.total} t={data.t} />;
}
