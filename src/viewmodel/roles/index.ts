/**
 * Perfis de acesso e a matriz de permissões. A matriz é substituída
 * inteira a cada gravação, então o ViewModel monta o conjunto completo em vez de
 * um diff.
 *
 * A rota vive no `*.vm.ts`, com os dois papéis: `createXPageInput` (o que o
 * `+data` chama, dos dois lados, antes do render) e `createXVM` (a reatividade
 * que a tela lê).
 *
 * @packageDocumentation
 */
export * from './role-create-page.vm';
export * from './role-list-page.vm';
export * from './role-permissions-page.vm';
export * from './vm-contracts';
export * from './i18n';
export * from './mutations';
export * from './queries';
export * from './schemas';
export * from './testing';
