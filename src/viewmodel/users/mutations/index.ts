/**
 * Escrita de usuários. Cada `*.mutation.ts` é uma operação
 * única, chamada por um handler da tela — não há store nem fila entre a intenção e
 * a chamada.
 *
 * @packageDocumentation
 */
export * from './create-user.mutation';
export * from './delete-user.mutation';
export * from './reset-user-password.mutation';
export * from './update-user.mutation';
