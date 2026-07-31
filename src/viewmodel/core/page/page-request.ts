/**
 * Contrato de requisição de página — a fronteira entre o Vike e o ViewModel.
 *
 * Os carregadores de página (`*.vm.ts`) recebem este tipo, nunca o
 * `PageContext` do Vike. Duas consequências práticas:
 *
 * • o ViewModel é testável sem levantar nada do Vike — basta um objeto
 *   literal;
 * • trocar (ou remover) o framework de roteamento não toca a lógica de
 *   aplicação: só o adaptador `toPageRequest` em `pages/`.
 *
 * `toPageRequest` aceita a forma do PageContext estruturalmente, sem importar
 * `vike/types` — é o que mantém esta camada livre do framework.
 *
 * @packageDocumentation
 */
import type { IncomingHeaders } from '@viewmodel/core/client/api-client';

/** Dados de uma requisição de página, independentes de framework. */
export interface PageRequest {
  /** Cabeçalhos da requisição — fonte do cookie de sessão e do locale. */
  headers: IncomingHeaders;
  /** URL original, com query string. */
  url: string;
  /** Parâmetros de rota (ex.: `id`), em base62 opaco. */
  routeParams: Record<string, string>;
  /** Status abortado a montante (ex.: 403 vindo do guard). */
  abortStatusCode?: number;
  /** Se a rota não casou com nenhuma página. */
  is404?: boolean;
}

/** Título e descrição de uma rota, consumidos pelo `<head>`. */
export interface PageMeta {
  title: string;
  description: string;
}

/**
 * Erro de domínio para "o recurso pedido não existe".
 *
 * O ViewModel sinaliza a ausência com este erro em vez de chamar
 * `render(404)` do Vike — traduzir para a resposta HTTP é papel do
 * composition root, não da lógica de aplicação.
 */
export class PageNotFoundError extends Error {
  constructor(message = 'Recurso não encontrado') {
    super(message);
    this.name = 'PageNotFoundError';
  }
}

/**
 * Extrai a query string da requisição.
 *
 * @param request Requisição de página.
 */
export function searchParams(request: PageRequest): URLSearchParams {
  // A base é irrelevante: `url` sempre chega como caminho absoluto do site.
  return new URL(request.url, 'http://localhost').searchParams;
}

/**
 * Lê um parâmetro de rota obrigatório.
 *
 * Lança em vez de devolver `undefined`: um segmento declarado na rota sempre
 * chega preenchido, então a ausência é erro de declaração da rota — e falhar
 * alto é melhor que propagar `undefined` até virar um 404 enganoso.
 *
 * @param request Requisição de página.
 * @param name    Nome do segmento declarado na rota (ex.: `id`).
 * @throws Se o parâmetro não estiver presente.
 */
export function routeParam(request: PageRequest, name: string): string {
  const value = request.routeParams[name];
  if (value === undefined) {
    throw new Error(`Parâmetro de rota ausente: "${name}". A rota declara esse segmento?`);
  }
  return value;
}

/** Forma mínima do PageContext do Vike de que o adaptador precisa. */
interface PageContextLike {
  headers?: unknown;
  urlOriginal: string;
  routeParams?: Record<string, string>;
  abortStatusCode?: number;
  // O Vike usa `null` para "ainda não decidido"; o contrato neutro normaliza
  // isso para um booleano.
  is404?: boolean | null;
}

/**
 * Adapta o `PageContext` do Vike para o contrato neutro do ViewModel.
 *
 * @param pageContext PageContext do Vike (aceito estruturalmente).
 */
export function toPageRequest(pageContext: PageContextLike): PageRequest {
  return {
    headers: pageContext.headers as IncomingHeaders,
    url: pageContext.urlOriginal,
    routeParams: pageContext.routeParams ?? {},
    abortStatusCode: pageContext.abortStatusCode,
    is404: pageContext.is404 ?? false,
  };
}
