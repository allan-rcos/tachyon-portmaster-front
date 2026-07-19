// ============================================================
//  Formatação de números, peso, porcentagem e datas (pt-BR).
//  Sem date-fns — usa Intl (Web Standard).
// ============================================================

const LOCALE = 'pt-BR';

const nf = new Intl.NumberFormat(LOCALE);
const nf2 = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function formatNumber(n: number): string {
  return nf.format(n);
}

/** Peso em kg com separador de milhar. */
export function formatWeight(kg: number): string {
  return `${nf2.format(kg)} kg`;
}

export function formatPercent(value: number): string {
  return `${nf2.format(value)}%`;
}

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

export function formatDate(iso: string): string {
  return df.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dtf.format(new Date(iso));
}
