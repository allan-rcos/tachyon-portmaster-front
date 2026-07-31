/**
 * O contrato neutro de página — a fronteira com o roteador.
 *
 * `PageRequest` (`{ headers, url, routeParams }`) substitui o `PageContext`
 * do Vike, e é o que torna um carregador testável com um objeto literal. `authorize`
 * decide acesso a partir da sessão; `page-errors` sinaliza domínio
 * (`PageNotFoundError`) em vez de status HTTP — traduzir isso em `render(404)`
 * é papel do composition root em `pages/`.
 *
 * @packageDocumentation
 */
export * from './authorize';
export * from './options';
export * from './page-errors';
export * from './page-request';
export * from './shell';
