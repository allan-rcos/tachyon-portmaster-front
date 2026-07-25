import { UserList } from '@view/users/components/UserList';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';


export default function UsersPage() {
  const data = useData<Data>();
  return <UserList items={data.items} total={data.total} t={data.t} />;
}
