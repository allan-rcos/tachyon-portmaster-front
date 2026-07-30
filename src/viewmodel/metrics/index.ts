/**
 * O painel — métricas agregadas do pátio. Só leitura.
 *
 * A rota vive no `*.vm.ts`, com os dois papéis: `createXPageInput` (o que o
 * `+data` chama, dos dois lados, antes do render) e `createXVM` (a reatividade
 * que a tela lê).
 *
 * @packageDocumentation
 */
export * from './dashboard-page.vm';
export * from './i18n';
export * from './queries';
export * from './testing';
