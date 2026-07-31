/**
 * Catálogos de mensagem e contratos de texto de produtos.
 *
 * O `text-contracts.ts` declara as interfaces `*Text` que a View recebe; os
 * `*.messages.ts` resolvem cada uma para um locale. Esquecer uma chave é erro de
 * `tsc`.
 *
 * @packageDocumentation
 */
export * from './product-create-page.messages';
export * from './product-edit-page.messages';
export * from './product-form.messages';
export * from './product-list-page.messages';
export * from './text-contracts';
