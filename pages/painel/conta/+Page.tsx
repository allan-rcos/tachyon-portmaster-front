import { AccountPage } from '@view/account/components/AccountPage';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

export default function Page() {
  const data = useData<Data>();
  return <AccountPage profile={data.profile} t={data.t} />;
}
