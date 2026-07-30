/**
 * Contêineres: listagem paginada por cursor, detalhe com manifesto
 * e telemetria, criação, edição, e as transições de ciclo de vida.
 *
 * A rota vive no `*.vm.ts`, com os dois papéis: `createXPageInput` (o que o
 * `+data` chama, dos dois lados, antes do render) e `createXVM` (a reatividade
 * que a tela lê).
 *
 * @packageDocumentation
 */
export * from './container-create-page.vm';
export * from './container-detail-page.vm';
export * from './container-edit-page.vm';
export * from './container-list-page.vm';
export * from './vm-contracts';
export * from './i18n';
export * from './mutations';
export * from './queries';
export * from './schemas';
export * from './testing';
