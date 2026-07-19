import type { PageContextServer } from 'vike/types';

export type Data = Awaited<ReturnType<typeof data>>;

// Título/descrição da página de erro (consumidos por pages/+Head.tsx).
// Estático — a página de erro não depende de dados do backend.
export async function data(pageContext: PageContextServer) {
  const is404 = pageContext.is404;
  return {
    title: is404 ? 'Página não encontrada' : 'Erro no servidor',
    description: is404
      ? 'A rota solicitada não existe.'
      : 'Ocorreu um erro inesperado ao renderizar esta página.',
  };
}
