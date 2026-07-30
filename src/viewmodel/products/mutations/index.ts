/**
 * Escrita de produtos. Cada `*.mutation.ts` é uma operação
 * única, chamada por um handler da tela — não há store nem fila entre a intenção e
 * a chamada.
 *
 * @packageDocumentation
 */
export * from './create-product.mutation';
export * from './delete-product.mutation';
export * from './update-product.mutation';
