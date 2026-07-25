// ============================================================
//  Resolução de locale a partir do cookie `flow-locale`, com fallback pt-BR.
//
//  Funciona nos dois lados: no SSR o cookie chega nos headers do request; no
//  navegador, em `document.cookie`. É o que permite a uma tela renderizar no
//  servidor ou no cliente sem mudar a resolução de texto — a base de todo o
//  i18n do projeto, já que o locale é sempre passado explicitamente
//  (`m.foo({}, { locale })`), sem estado global.
// ============================================================
import { readHeader, type IncomingHeaders } from '@viewmodel/core/client/api-client';
import { parseCookies } from '@viewmodel/core/utils/cookies';

/** Locales suportados pelo projeto (espelha `project.inlang/settings.json`). */
export type Locale = 'pt-BR' | 'en' | 'es';

const LOCALES: readonly Locale[] = ['pt-BR', 'en', 'es'];

/** Locale base, usado quando o cookie está ausente ou é desconhecido. */
export const DEFAULT_LOCALE: Locale = 'pt-BR';

/**
 * Converte uma string de cookies no locale correspondente.
 * @param cookie Conteúdo do cabeçalho `Cookie`, ou `document.cookie`.
 */
function fromCookieHeader(cookie: string | undefined): Locale {
  const wanted = parseCookies(cookie)['flow-locale'] as Locale | undefined;
  return wanted && LOCALES.includes(wanted) ? wanted : DEFAULT_LOCALE;
}

/**
 * Resolve o locale de uma requisição SSR.
 *
 * @param headers Cabeçalhos do request. Omitir cai no locale padrão.
 */
export function resolveLocale(headers?: IncomingHeaders): Locale {
  return fromCookieHeader(readHeader(headers, 'cookie'));
}

/**
 * Resolve o locale no navegador, lendo `document.cookie`.
 *
 * Fora do navegador (SSR, testes em Node) devolve o locale padrão em vez de
 * lançar — chamar isto no servidor é engano de composição, não erro fatal.
 */
export function resolveBrowserLocale(): Locale {
  if (typeof document === 'undefined') return DEFAULT_LOCALE;
  return fromCookieHeader(document.cookie);
}
