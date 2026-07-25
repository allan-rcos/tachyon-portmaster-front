// ============================================================
//  Carregador da página de erro. Traduz o status abortado a montante
//  (403 vindo do guard, 404 de rota inexistente, 500 no resto) para o texto
//  exibido. Estático: não toca a API.
// ============================================================
import type { PageMeta, PageRequest } from './page/page-request';

/** Dados que a página de erro entrega à View. */
export type ErrorPageData = PageMeta;

/**
 * Resolve título e descrição do erro a partir do status da requisição.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export function loadErrorPage(request: PageRequest): ErrorPageData {
  if (request.abortStatusCode === 403) {
    return {
      title: 'Acesso negado',
      description: 'Você não tem permissão para acessar esta página.',
    };
  }
  return request.is404
    ? { title: 'Página não encontrada', description: 'A rota solicitada não existe.' }
    : {
        title: 'Erro no servidor',
        description: 'Ocorreu um erro inesperado ao renderizar esta página.',
      };
}
