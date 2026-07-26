import { AccountScreen } from '@view/account/screens/AccountScreen';
import { createAccountPageVM, type AccountPageInput } from '@viewmodel/account/account-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/** Único ponto de composição da rota. */
export default function Page(): JSX.Element {
  const input = useData<AccountPageInput>();
  return <AccountScreen vm={createAccountPageVM(input)} />;
}
