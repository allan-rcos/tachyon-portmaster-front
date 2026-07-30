/**
 * Catálogos de mensagem e contratos de texto de contêineres.
 *
 * O `text-contracts.ts` declara as interfaces `*Text` que a View recebe; os
 * `*.messages.ts` resolvem cada uma para um locale. Esquecer uma chave é erro de
 * `tsc`.
 *
 * @packageDocumentation
 */
export * from './container-create-page.messages';
export * from './container-detail-page.messages';
export * from './container-edit-page.messages';
export * from './container-form.messages';
export * from './container-list-page.messages';
export * from './text-contracts';
