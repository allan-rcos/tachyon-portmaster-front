/**
 * Catálogos de mensagem e contratos de texto de usuários.
 *
 * O `text-contracts.ts` declara as interfaces `*Text` que a View recebe; os
 * `*.messages.ts` resolvem cada uma para um locale. Esquecer uma chave é erro de
 * `tsc`.
 *
 * @packageDocumentation
 */
export * from './text-contracts';
export * from './user-create-page.messages';
export * from './user-edit-page.messages';
export * from './user-form.messages';
export * from './user-list-page.messages';
