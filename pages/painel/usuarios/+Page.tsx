import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

import { UserList } from '@/features/users/components/UserList';

export default function UsersPage() {
  const data = useData<Data>();
  return <UserList items={data.items} total={data.total} t={data.t} />;
}
