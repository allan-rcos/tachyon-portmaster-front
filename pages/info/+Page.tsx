import { SystemInfoScreen } from '@view/info/screens/SystemInfoScreen';
import {
  createSystemInfoVM,
  type SystemInfoPageInput,
} from '@viewmodel/system/system-info-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

export default function Page(): JSX.Element {
  const input = useData<SystemInfoPageInput>();
  return <SystemInfoScreen vm={createSystemInfoVM(input)} />;
}
