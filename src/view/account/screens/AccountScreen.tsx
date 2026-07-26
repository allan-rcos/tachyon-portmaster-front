import { AccountPage } from '@view/account/components/AccountPage';
import type { AccountPageVM } from '@viewmodel/account/account-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela da conta própria. */
export interface AccountScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: AccountPageVM;
}

/**
 * Tela da conta própria. Stateless: o perfil já veio resolvido pelo `+data`.
 *
 * @param props.vm ViewModel da rota.
 */
export function AccountScreen(props: AccountScreenProps): JSX.Element {
  return <AccountPage vm={props.vm} />;
}
