import { Icon } from '@view/core/components/Icon';
import { signOut } from '@viewmodel/auth/mutations/sign-out.mutation';
import { createSignal, type JSX } from 'solid-js';

import styles from './LogoutButton.island.module.scss';

export interface LogoutButtonProps {
  label: string;
  /** Destino após sair, já montado pelo `shellNav`. */
  href: string;
}

/**
 * Encerra a sessão e volta ao login.
 *
 * Quem invalida a sessão é o backend (`POST /v1/auth/logout`), não este botão:
 * `auth_token` e `refresh_token` são HttpOnly, então o `deleteCookie` que
 * estava aqui não apagava nada e o usuário continuava logado no próximo SSR.
 *
 * A navegação é `location.href`, e não client-side: só um documento novo
 * descarta o `data` já resolvido das rotas do painel.
 */
export function LogoutButton(props: LogoutButtonProps): JSX.Element {
  const [leaving, setLeaving] = createSignal(false);

  const onClick = () => {
    setLeaving(true);
    const destination = props.href;
    void signOut().then(() => {
      window.location.href = destination;
    });
  };

  return (
    <button type="button" class={styles.btn} onClick={onClick} disabled={leaving()}>
      <Icon name="logout" size={18} />
      <span>{props.label}</span>
    </button>
  );
}
