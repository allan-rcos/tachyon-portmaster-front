/**
 * Catálogos de mensagem e contratos de texto de conta.
 *
 * O `text-contracts.ts` declara as interfaces `*Text` que a View recebe; os
 * `*.messages.ts` resolvem cada uma para um locale. Esquecer uma chave é erro de
 * `tsc`.
 *
 * @packageDocumentation
 */
export * from './account-page.messages';
export * from './text-contracts';
