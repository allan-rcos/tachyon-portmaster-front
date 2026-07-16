import { useData } from 'vike-solid/useData';
import { usePageContext } from 'vike-solid/usePageContext';

// Página de erro do Vike: renderizada para rotas inexistentes (404) e
// erros de runtime (500). Sem ela, o Vike responde 500 genérico.
export default function ErrorPage() {
  const pageContext = usePageContext();
  const is404 = pageContext.is404;

  return (
    <main style={{ 'max-width': '600px', margin: '4rem auto', 'font-family': 'sans-serif', padding: '0 1rem' }}>
      <h1 style={{ 'font-size': '2rem', color: '#222', margin: '0 0 0.5rem 0' }}>
        {is404 ? '404 — Página não encontrada' : '500 — Erro no servidor'}
      </h1>
      <p style={{ color: '#666' }}>
        {is404
          ? 'A rota solicitada não existe.'
          : 'Ocorreu um erro inesperado ao renderizar esta página.'}
      </p>
      <p><a href="/info" style={{ color: '#6b8e23' }}>← Ir para Informações do Sistema</a></p>
    </main>
  );
}
