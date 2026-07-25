import { Icon } from '@view/core/components/Icon';
import { deleteCookie } from '@viewmodel/core/utils/cookies';
import type { JSX } from 'solid-js';

import styles from './LogoutButton.island.module.scss';


/** Encerra a sessão: limpa o cookie de auth (same-origin token) e volta ao
 *  login. O guard revalida a sessão no próximo SSR. */
export function LogoutButton(props: { label: string }): JSX.Element {
  const logout = () => {
    deleteCookie('auth_token');
    window.location.href = '/entrar';
  };
  return (
    <button type="button" class={styles.btn} onClick={logout}>
      <Icon name="logout" size={18} />
      <span>{props.label}</span>
    </button>
  );
}
