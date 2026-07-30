import { Icon } from '@view/core/components/Icon';
import { deleteCookie } from '@viewmodel/core/utils/cookies';
import { html, type TemplateResult } from 'lit';

import styles from './LogoutButton.island.module.scss';

export interface LogoutButtonProps {
  label: string;
}

/**
 * Encerra a sessão: limpa o cookie de auth (same-origin token) e volta ao
 * login. O guard revalida a sessão no próximo SSR.
 *
 * Não é classe: não guarda estado. Continua no diretório `islands/` porque o
 * que ele faz — mexer em cookie e navegar — só existe no navegador.
 */
export function LogoutButton(props: LogoutButtonProps): TemplateResult {
  const logout = () => {
    deleteCookie('auth_token');
    window.location.href = '/entrar';
  };

  return html`<button type="button" class=${styles.btn} @click=${logout}>
    ${Icon({ name: 'logout', size: 18 })}
    <span>${props.label}</span>
  </button>`;
}
