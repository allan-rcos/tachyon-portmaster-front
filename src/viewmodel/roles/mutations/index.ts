/**
 * Escrita de perfis. Cada `*.mutation.ts` é uma operação
 * única, chamada por um handler da tela — não há store nem fila entre a intenção e
 * a chamada.
 *
 * @packageDocumentation
 */
export * from './create-role.mutation';
export * from './update-role-permissions.mutation';
