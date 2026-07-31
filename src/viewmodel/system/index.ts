/**
 * Informação de sistema (`/info`) — versão, build e saúde. Sem
 * mutação e sem schema.
 *
 * A rota vive no `*.vm.ts`, com os dois papéis: `createXPageInput` (o que o
 * `+data` chama, dos dois lados, antes do render) e `createXVM` (a reatividade
 * que a tela lê).
 *
 * @packageDocumentation
 */
export * from './system-info-page.vm';
export * from './i18n';
