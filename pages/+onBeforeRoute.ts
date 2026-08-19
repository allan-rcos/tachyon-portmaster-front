import { localePrefix, splitLocale } from '@viewmodel/core/i18n/locale';
import { redirect } from 'vike/abort';
import type { PageContext } from 'vike/types';

export { onBeforeRoute };

/**
 * Tira o prefixo de locale antes do roteamento.
 *
 * O idioma ativo é o começo da URL — `/en/painel/produtos` — mas as rotas do
 * projeto são declaradas sem ele (`pages/painel/produtos/`). Este hook devolve
 * o caminho SEM prefixo em `urlLogical`, então nenhum arquivo de rota precisou
 * mudar de lugar nem ganhar um segmento `@locale`: o prefixo é resolvido uma
 * vez, aqui, e some do resto do sistema.
 *
 * Quem precisa do idioma depois não o vê: o `toPageRequest` o resolve de
 * `urlOriginal` (que o Vike preserva intacto) e entrega `request.href` e
 * `request.t` já amarrados a ele.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
function onBeforeRoute(pageContext: PageContext): { pageContext: { urlLogical: string } } {
  const { locale, path } = splitLocale(pageContext.urlOriginal);

  if (path === '/' || path === '') {
    throw redirect(`${localePrefix(locale)}/painel`);
  }

  return { pageContext: { urlLogical: path } };
}
