/**
 * Resolução do cliente HTTP por ambiente. `resolveClient(headers)` devolve o
 * cliente do servidor quando recebe os cabeçalhos do request (SSR, repassando o
 * cookie de sessão) e o cliente do navegador quando não recebe.
 *
 * É o único ponto do app que sabe onde fica `/api`, qual wire está ativo e como
 * uma credencial atravessa o SSR. O {@link "src/model/core" | @model/core} é puro
 * justamente para que essa decisão caiba aqui.
 *
 * @packageDocumentation
 */
export * from './api-client';
