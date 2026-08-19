// ============================================================
//  Casca única entre o Vike e os carregadores de página do ViewModel.
//
//  Substitui o `pages/+guard.ts` e os 15 `+permissions.js`: a decisão de
//  autorização passou a viver no `createXPageInput` da própria rota (que a
//  declara e a avalia), e aqui só se TRADUZ o resultado para o vocabulário do
//  framework — `redirect` para quem não tem sessão, `render(403)` para quem tem
//  sessão e não tem permissão, `render(404)` para recurso inexistente.
//
//  A separação importa: `bun run test` exercita a autorização chamando o
//  `createXPageInput` direto, sem levantar Vike nenhum, porque o que ele produz
//  é um erro de domínio e não uma resposta HTTP.
// ============================================================
import { localeFromUrl, localizedHref } from '@viewmodel/core/i18n/locale';
import { ForbiddenError, UnauthorizedError } from '@viewmodel/core/page/page-errors';
import { PageNotFoundError, toPageRequest } from '@viewmodel/core/page/page-request';
import type { PageRequest } from '@viewmodel/core/page/page-request';
import { redirect, render } from 'vike/abort';
import type { PageContext } from 'vike/types';

/**
 * Roda o carregador de uma rota e traduz seus erros de domínio.
 *
 * @template T Formato do dado da rota (`XPageInput`).
 * @param pageContext Contexto da requisição, dado pelo Vike.
 * @param load        Carregador da rota (`createXPageInput`).
 * @throws Abortagens do Vike (`redirect`/`render`), que o framework captura.
 */
export async function toPageInput<T>(
  pageContext: PageContext,
  load: (request: PageRequest) => Promise<T>,
): Promise<T> {
  try {
    return await load(toPageRequest(pageContext));
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      const locale = localeFromUrl(pageContext.urlOriginal);
      const back = encodeURIComponent(pageContext.urlOriginal);
      throw redirect(`${localizedHref('/entrar', locale)}?redirect=${back}`);
    }
    if (error instanceof ForbiddenError) throw render(403);
    if (error instanceof PageNotFoundError) throw render(404);
    throw error;
  }
}
