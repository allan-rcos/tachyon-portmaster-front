/**
 * Catálogos de mensagem e contratos de texto de perfis.
 *
 * O `text-contracts.ts` declara as interfaces `*Text` que a View recebe; os
 * `*.messages.ts` resolvem cada uma para um locale. Esquecer uma chave é erro de
 * `tsc`.
 *
 * @packageDocumentation
 */
export * from './role-create-page.messages';
export * from './role-form.messages';
export * from './role-list-page.messages';
export * from './role-permissions-page.messages';
export * from './text-contracts';
