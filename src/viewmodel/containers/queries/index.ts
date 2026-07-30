/**
 * Leitura de contêineres. Cada `*.query.ts` recebe os cabeçalhos do
 * request (ou nada, no navegador), chama o Model e devolve o dado já no formato
 * que a página consome.
 *
 * @packageDocumentation
 */
export * from './get-container-summary.query';
export * from './get-container.query';
export * from './list-containers.query';
