// ============================================================
//  Formatação de números, peso, porcentagem e datas (pt-BR).
//  Sem date-fns — usa Intl (Web Standard).
// ============================================================

const LOCALE = 'pt-BR';

const nf = new Intl.NumberFormat(LOCALE);
const nf2 = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

/**
 * Formata um número inteiro no padrão pt-BR.
 *
 * @param n Valor a formatar.
 */
export function formatNumber(n: number): string {
  return nf.format(n);
}

/**
 * Formata um peso em quilos, com separador de milhar.
 *
 * @param kg Peso em quilos.
 */
export function formatWeight(kg: number): string {
  return `${nf2.format(kg)} kg`;
}

/**
 * Formata um percentual já em escala de 0 a 100.
 *
 * @param value Percentual a formatar.
 */
export function formatPercent(value: number): string {
  return `${nf2.format(value)}%`;
}

/**
 * Formata a densidade de um produto.
 *
 * @param d Densidade em t/m³.
 */
export function formatDensity(d: number): string {
  return `${nf2.format(d)} t/m³`;
}

const df = new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric' });
const dtf = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * Formata uma data ISO no padrão pt-BR.
 *
 * @param iso Data em ISO 8601.
 */
export function formatDate(iso: string): string {
  return df.format(new Date(iso));
}

/**
 * Formata data e hora ISO no padrão pt-BR.
 *
 * @param iso Data em ISO 8601.
 */
export function formatDateTime(iso: string): string {
  return dtf.format(new Date(iso));
}
