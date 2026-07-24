import { Show } from 'solid-js';
import { usePageContext } from 'vike-solid/usePageContext';

import styles from './ErrorPage.module.scss';

// Página de erro do Vike: renderizada para 403 (Forbidden, via render(403) no
// guard de permissões), rotas inexistentes (404) e erros de runtime (500).
export default function ErrorPage() {
  const pageContext = usePageContext();
  const status = (pageContext as { abortStatusCode?: number }).abortStatusCode;
  const forbidden = status === 403;
  const is404 = pageContext.is404;

  const title = forbidden
    ? '403 — Acesso negado'
    : is404
      ? '404 — Página não encontrada'
      : '500 — Erro no servidor';
  const message = forbidden
    ? 'Você não tem permissão para acessar esta página.'
    : is404
      ? 'A rota solicitada não existe.'
      : 'Ocorreu um erro inesperado ao renderizar esta página.';

  return (
    <main class={styles.page}>
      <h1 class={styles.title}>{title}</h1>
      <p class={styles.message}>{message}</p>
      <Show when={!forbidden}>
        <p>
          <a class={styles.link} href="/painel">
            ← Ir para o painel
          </a>
        </p>
      </Show>
    </main>
  );
}
