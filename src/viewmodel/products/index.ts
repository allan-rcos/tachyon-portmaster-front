/**
 * Produtos: catálogo, criação e edição.
 *
 * A rota vive no `*.vm.ts`, com os dois papéis: `createXPageInput` (o que o
 * `+data` chama, dos dois lados, antes do render) e `createXVM` (a reatividade
 * que a tela lê).
 *
 * @packageDocumentation
 */
export * from './product-create-page.vm';
export * from './product-edit-page.vm';
export * from './product-list-page.vm';
export * from './vm-contracts';
export * from './i18n';
export * from './mutations';
export * from './queries';
export * from './schemas';
export * from './testing';
