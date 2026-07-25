// ============================================================
//  Contexto de um ViewModel de tela.
//
//  É o que torna um VM indiferente ao lado em que roda:
//
//    • no navegador  → `{ params }` apenas; o cookie viaja sozinho e o locale
//      sai de `document.cookie`;
//    • no servidor   → `{ headers }` também; a query passa a usar o client de
//      loopback e o locale sai do header.
//
//  Mover uma tela entre SSR e cliente é, por construção, decidir se este objeto
//  carrega `headers` — nada mais no VM muda. Hoje as telas de `/painel` rodam
//  no navegador (o servidor só faz o guard); levar uma de volta para o SSR é
//  chamar o mesmo VM dentro de um `+data.ts`, passando os headers.
// ============================================================
import type { IncomingHeaders } from '../client/api-client';
import { resolveBrowserLocale, resolveLocale, type Locale } from '../i18n/locale';

/** Contexto de execução de um ViewModel de tela. */
export interface VMContext {
  /** Cabeçalhos do request no SSR. Omitir para rodar no navegador. */
  headers?: IncomingHeaders;
  /** Parâmetros de rota (ex.: `id`), em base62 opaco. */
  routeParams?: Record<string, string>;
  /** URL da rota, com query string — origem dos filtros e da paginação. */
  url?: string;
  /** Locale explícito; se omitido, é resolvido do contexto. */
  locale?: Locale;
}

/**
 * Resolve o locale do contexto: explícito, do header (SSR) ou do documento.
 *
 * @param context Contexto do ViewModel.
 */
export function contextLocale(context: VMContext): Locale {
  if (context.locale) return context.locale;
  return context.headers === undefined ? resolveBrowserLocale() : resolveLocale(context.headers);
}

/**
 * Extrai a query string do contexto.
 *
 * @param context Contexto do ViewModel.
 * @returns Os parâmetros da URL, ou `undefined` quando não há URL.
 */
export function contextParams(context: VMContext): URLSearchParams | undefined {
  if (!context.url) return undefined;
  return new URL(context.url, 'http://localhost').searchParams;
}

/**
 * Lê um parâmetro de rota obrigatório.
 *
 * @param context Contexto do ViewModel.
 * @param name    Nome do parâmetro declarado na rota (ex.: `id`).
 * @throws Se o parâmetro não estiver presente — indica rota mal declarada.
 */
export function routeParam(context: VMContext, name: string): string {
  const value = context.routeParams?.[name];
  if (value === undefined) {
    throw new Error(`Parâmetro de rota ausente: "${name}". A rota declara esse segmento?`);
  }
  return value;
}
