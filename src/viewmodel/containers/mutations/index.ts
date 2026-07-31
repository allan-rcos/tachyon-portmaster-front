/**
 * Escrita de contêineres. Cada `*.mutation.ts` é uma operação
 * única, chamada por um handler da tela — não há store nem fila entre a intenção e
 * a chamada.
 *
 * @packageDocumentation
 */
export * from './create-container.mutation';
export * from './delete-container.mutation';
export * from './dispatch-container.mutation';
export * from './load-manifest-item.mutation';
export * from './seal-container.mutation';
export * from './unload-manifest-item.mutation';
export * from './update-container.mutation';
