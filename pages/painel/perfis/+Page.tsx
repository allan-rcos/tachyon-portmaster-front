import { RoleList } from '@view/roles/components/RoleList';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';


export default function RolesPage() {
  const data = useData<Data>();
  return <RoleList items={data.items} total={data.total} t={data.t} />;
}
