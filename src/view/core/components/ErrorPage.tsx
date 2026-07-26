import styles from '@view/core/styles/ErrorPage.module.scss';
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

/** Estado de erro a exibir: 403 do guard, 404 de rota ou 500 de runtime. */
export interface ErrorPageProps {
  forbidden: boolean;
  is404: boolean;
}

/**
 * Tela de erro. Recebe o estado já classificado — não inspeciona o PageContext.
 *
 * @param props.forbidden Se o acesso foi negado por falta de permissão (403).
 * @param props.is404     Se a rota não existe.
 */
export function ErrorPage(props: ErrorPageProps): JSX.Element {
  const title = () =>
    props.forbidden
      ? '403 — Acesso negado'
      : props.is404
        ? '404 — Página não encontrada'
        : '500 — Erro no servidor';
  const message = () =>
    props.forbidden
      ? 'Você não tem permissão para acessar esta página.'
      : props.is404
        ? 'A rota solicitada não existe.'
        : 'Ocorreu um erro inesperado ao renderizar esta página.';

  return (
    <main class={styles.page}>
      <h1 class={styles.title}>{title()}</h1>
      <p class={styles.message}>{message()}</p>
      <Show when={!props.forbidden}>
        <p>
          <a class={styles.link} href="/painel">
            ← Ir para o painel
          </a>
        </p>
      </Show>
    </main>
  );
}
