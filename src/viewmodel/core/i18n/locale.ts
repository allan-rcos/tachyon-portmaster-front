/**
 * Locale da requisição — resolvido pelo PREFIXO DA URL, com pt-BR como base.
 *
 * `/painel/produtos` é pt-BR; `/en/painel/produtos` e `/es/painel/produtos` são
 * as outras duas. O locale base nunca aparece na URL: é o que mantém as rotas
 * do produto (que é brasileiro) curtas e estáveis.
 *
 * Antes isto vinha do cookie `flow-locale`, que ninguém nunca escrevia — não há
 * seletor de idioma em lugar nenhum do app, então na prática o produto era
 * pt-BR fixo e os catálogos `en`/`es` (completos, 145 chaves cada) estavam
 * inalcançáveis. Com o prefixo o idioma vira endereço: compartilhável,
 * indexável e resolvido igual nos dois lados, sem estado global.
 *
 * O locale continua sendo passado explicitamente para o paraglide
 * (`m.foo({}, { locale })`) — nada aqui instala estado ambiente.
 *
 * @packageDocumentation
 */

/** Locales suportados pelo projeto (espelha `project.inlang/settings.json`). */
export type Locale = 'pt-BR' | 'en' | 'es';

/** Locale base: o do produto, e o único que NÃO leva prefixo na URL. */
export const DEFAULT_LOCALE: Locale = 'pt-BR';

/** Todos os locales, na ordem em que o seletor os mostra. */
export const LOCALES: readonly Locale[] = [DEFAULT_LOCALE, 'en', 'es'];

/**
 * Prefixo de URL de cada locale não-base.
 *
 * `pt-BR` está ausente de propósito: ele é a ausência de prefixo. Manter o mapa
 * só com os prefixados evita a pergunta "e se alguém digitar `/pt-BR/painel`?"
 * virar dois caminhos válidos para a mesma página.
 */
const PREFIX_TO_LOCALE: Readonly<Record<string, Locale>> = {
  en: 'en',
  es: 'es',
};

/**
 * Segmento de URL de um locale, ou `''` para o base.
 *
 * @param locale Locale a representar na URL.
 */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

/** Resultado de separar o prefixo de locale de um caminho. */
export interface SplitPath {
  /** Locale que o prefixo indicava, ou o base quando não havia prefixo. */
  locale: Locale;
  /** O caminho SEM o prefixo — o que as rotas do Vike casam. */
  path: string;
}

/**
 * Separa o prefixo de locale de um caminho.
 *
 * Aceita caminho com querystring; ela volta intacta em `path`.
 *
 * @param url Caminho da requisição, ex.: `/en/painel/produtos?cursor=x`.
 */
export function splitLocale(url: string): SplitPath {
  const [, head = '', rest = ''] = /^\/([^/?#]*)(.*)$/.exec(url) ?? [];
  const locale = PREFIX_TO_LOCALE[head];
  if (!locale) return { locale: DEFAULT_LOCALE, path: url };
  // `/en` sozinho vira `/`, não `''` — senão o Vike não casa a raiz.
  return { locale, path: rest.startsWith('/') || rest === '' ? rest || '/' : `/${rest}` };
}

/**
 * Resolve só o locale de uma URL.
 *
 * @param url Caminho da requisição.
 */
export function localeFromUrl(url: string): Locale {
  return splitLocale(url).locale;
}

/**
 * Monta um caminho interno no locale dado.
 *
 * Todo href do app passa por aqui: é o que impede uma navegação de "cair" para
 * pt-BR no meio de uma sessão em espanhol. Os ViewModels a usam ao montar
 * `listHref`/`editHref`; a View a usa nos links fixos da barra lateral.
 *
 * @param path   Caminho SEM prefixo, começando com `/` (ex.: `/painel/produtos`).
 * @param locale Locale de destino.
 */
export function localizedHref(path: string, locale: Locale): string {
  return `${localePrefix(locale)}${path}`;
}

/**
 * Troca o locale de uma URL já prefixada, preservando o resto.
 *
 * É o que o seletor de idioma usa: ele não sabe em que página está.
 *
 * @param url    URL atual, com ou sem prefixo.
 * @param locale Locale de destino.
 */
export function switchLocale(url: string, locale: Locale): string {
  return localizedHref(splitLocale(url).path, locale);
}
