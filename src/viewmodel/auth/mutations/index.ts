/**
 * Escrita de autenticação. Cada `*.mutation.ts` é uma operação
 * única, chamada por um handler da tela — não há store nem fila entre a intenção e
 * a chamada.
 *
 * @packageDocumentation
 */
export * from './sign-in.mutation';
export * from './sign-out.mutation';
