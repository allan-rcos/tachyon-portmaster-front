// ============================================================
//  Formatação de números, peso, porcentagem e datas.
//
//  NÃO usa `Intl`. O comentário anterior deste arquivo dizia "usa Intl (Web
//  Standard)" — o que era verdade e ainda assim inviável: o **txiki.js não
//  implementa `Intl`** (nem o objeto global existe). Enquanto as telas de
//  /painel eram `ClientOnly`, isso passou despercebido porque a formatação só
//  rodava no navegador. Com o ViewModel entregando dado já formatado pelo
//  `+data`, ela passou a rodar no SERVIDOR — e o módulo estourava no load,
//  antes de qualquer render.
//
//  Ganho colateral de não usar `Intl`: servidor e cliente executam exatamente o
//  mesmo código, então a string é idêntica dos dois lados e não há risco de
//  divergência na hidratação.
//
//  O locale deixou de ser fixo em pt-BR: quem chama já o conhece (o
//  `createXPageInput` o resolveu do cookie do request), então passá-lo é de
//  graça e o texto finalmente acompanha os três locales do projeto.
// ============================================================
import { DEFAULT_LOCALE, type Locale } from '@viewmodel/core/i18n/locale';
import { format } from 'date-fns';
import { enUS, es, ptBR } from 'date-fns/locale';
import numbro from 'numbro';
import esLanguage from 'numbro/languages/es-ES.js';
import ptBRLanguage from 'numbro/languages/pt-BR.js';


// O numbro embute apenas `en-US`; os demais são registrados uma vez, no load.
numbro.registerLanguage(ptBRLanguage);
numbro.registerLanguage(esLanguage);

const NUMBRO_TAG: Record<Locale, string> = {
  'pt-BR': 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

const DATE_LOCALE = { 'pt-BR': ptBR, en: enUS, es } as const;

// `dd/MM/yyyy` em pt-BR e es; `MM/dd/yyyy` em inglês — a ordem dos campos é a
// única diferença que importa aqui, e ela não sai do objeto de locale do
// date-fns (que só carrega nomes de mês, dia etc.).
const DATE_PATTERN: Record<Locale, string> = {
  'pt-BR': 'dd/MM/yyyy',
  en: 'MM/dd/yyyy',
  es: 'dd/MM/yyyy',
};

const DATE_TIME_PATTERN: Record<Locale, string> = {
  'pt-BR': 'dd/MM/yyyy HH:mm',
  en: 'MM/dd/yyyy hh:mm a',
  es: 'dd/MM/yyyy HH:mm',
};

/**
 * Aplica o idioma do numbro e formata, restaurando o anterior em seguida.
 *
 * O numbro guarda o idioma em estado global — trocá-lo sem restaurar deixaria
 * uma formatação vazando para a próxima, que no SSR pode ser de outro request.
 *
 * @param locale  Locale já resolvido.
 * @param value   Valor a formatar.
 * @param options Opções de formatação do numbro.
 */
function withLocale(locale: Locale, value: number, options: numbro.Format): string {
  const previous = numbro.language();
  numbro.setLanguage(NUMBRO_TAG[locale]);
  try {
    return numbro(value).format(options);
  } finally {
    numbro.setLanguage(previous);
  }
}

/**
 * Formata um número inteiro com separador de milhar.
 *
 * @param n      Valor a formatar.
 * @param locale Locale da apresentação.
 */
export function formatNumber(n: number, locale: Locale = DEFAULT_LOCALE): string {
  return withLocale(locale, n, { thousandSeparated: true, mantissa: 0 });
}

/**
 * Formata um número com até duas casas decimais, sem zeros à direita.
 *
 * É a base de `formatWeight`/`formatPercent`/`formatDensity`, e também serve
 * sozinha quando a unidade é desenhada à parte (o painel mostra o número grande
 * e o `%` menor e apagado).
 *
 * @param n      Valor a formatar.
 * @param locale Locale da apresentação.
 */
export function formatDecimal(n: number, locale: Locale = DEFAULT_LOCALE): string {
  return withLocale(locale, n, { thousandSeparated: true, mantissa: 2, trimMantissa: true });
}

/**
 * Formata um peso em quilos, com separador de milhar.
 *
 * @param kg     Peso em quilos.
 * @param locale Locale da apresentação.
 */
export function formatWeight(kg: number, locale: Locale = DEFAULT_LOCALE): string {
  return `${formatDecimal(kg, locale)} kg`;
}

/**
 * Formata um percentual já em escala de 0 a 100.
 *
 * @param value  Percentual a formatar.
 * @param locale Locale da apresentação.
 */
export function formatPercent(value: number, locale: Locale = DEFAULT_LOCALE): string {
  return `${formatDecimal(value, locale)}%`;
}

/**
 * Formata a densidade de um produto.
 *
 * @param d      Densidade em t/m³.
 * @param locale Locale da apresentação.
 */
export function formatDensity(d: number, locale: Locale = DEFAULT_LOCALE): string {
  return `${formatDecimal(d, locale)} t/m³`;
}

/**
 * Formata uma data ISO.
 *
 * @param iso    Data em ISO 8601.
 * @param locale Locale da apresentação.
 */
export function formatDate(iso: string, locale: Locale = DEFAULT_LOCALE): string {
  return format(new Date(iso), DATE_PATTERN[locale], { locale: DATE_LOCALE[locale] });
}

/**
 * Formata data e hora ISO.
 *
 * @param iso    Data em ISO 8601.
 * @param locale Locale da apresentação.
 */
export function formatDateTime(iso: string, locale: Locale = DEFAULT_LOCALE): string {
  return format(new Date(iso), DATE_TIME_PATTERN[locale], { locale: DATE_LOCALE[locale] });
}
