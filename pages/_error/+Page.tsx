import { usePageContext } from 'vike-solid/usePageContext';

import styles from './ErrorPage.module.scss';

// Página de erro do Vike: renderizada para rotas inexistentes (404) e
// erros de runtime (500). Sem ela, o Vike responde 500 genérico.
export default function ErrorPage() {
  const pageContext = usePageContext();
  const is404 = pageContext.is404;

  return (
    <main class={styles.page}>
      <h1 class={styles.title}>
        {is404 ? '404 — Página não encontrada' : '500 — Erro no servidor'}
      </h1>
      <p class={styles.message}>
        {is404
          ? 'A rota solicitada não existe.'
          : 'Ocorreu um erro inesperado ao renderizar esta página.'}
      </p>
      <p>
        <a class={styles.link} href="/painel">
          ← Ir para o painel
        </a>
      </p>
    </main>
  );
}
