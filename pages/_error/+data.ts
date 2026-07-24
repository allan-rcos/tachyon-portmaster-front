import type { PageContextServer } from 'vike/types';

export interface Data {
  title: string;
  description: string;
}

// Título/descrição da página de erro (consumidos por pages/+Head.tsx).
// Estático — distingue 403 (Forbidden, via render(403) no guard), 404 e 500.
export async function data(pageContext: PageContextServer): Promise<Data> {
  const status = (pageContext as { abortStatusCode?: number }).abortStatusCode;
  if (status === 403) {
    return {
      title: 'Acesso negado',
      description: 'Você não tem permissão para acessar esta página.',
    };
  }
  const is404 = pageContext.is404;
  return {
    title: is404 ? 'Página não encontrada' : 'Erro no servidor',
    description: is404
      ? 'A rota solicitada não existe.'
      : 'Ocorreu um erro inesperado ao renderizar esta página.',
  };
}
