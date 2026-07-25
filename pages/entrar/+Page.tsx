import { LoginPage } from '@view/auth/components/LoginPage';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

export default function Page() {
  const data = useData<Data>();
  return <LoginPage t={data.t} />;
}
