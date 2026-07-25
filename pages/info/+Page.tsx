import { SystemInfoPanel } from '@view/info/components/SystemInfoPanel';
import { useData } from 'vike-solid/useData';

import type { DataProps } from './+data';

export default function Page() {
  const data = useData<DataProps>();
  return <SystemInfoPanel frontend={data.frontend} />;
}
