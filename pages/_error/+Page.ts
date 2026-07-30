/**
 * Composição de `catch-all de erro` — A página de erro do Vike: 403 vindo da autorização, 404 de rota ou de
 * recurso inexistente, 500 de runtime.
 *
 * Único ponto onde View e ViewModel se encontram para esta rota: constrói o VM a
 * partir do `pageContext.data` e devolve a tela. Sem markup, sem CSS, sem lógica.
 *
 * @packageDocumentation
 */
import { ErrorPage } from '@view/core/components/ErrorPage';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Página de erro do Vike: 403 do guard, 404 de rota ou 500 de runtime.
 *
 * Recebe `pageContext` por argumento — o `usePageContext()` do vike-solid era um
 * hook, e não há mais contexto de framework a consultar.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const forbidden = (pageContext as { abortStatusCode?: number }).abortStatusCode === 403;
  const is404 = pageContext.is404 ?? false;
  return () => ErrorPage({ forbidden, is404 });
}
