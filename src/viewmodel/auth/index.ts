/**
 * Login e encerramento de sessão — a única rota pública do app.
 *
 * A rota vive no `*.vm.ts`, com os dois papéis: `createXPageInput` (o que o
 * `+data` chama, dos dois lados, antes do render) e `createXVM` (a reatividade
 * que a tela lê).
 *
 * @packageDocumentation
 */
export * from './login-page.vm';
export * from './i18n';
export * from './mutations';
export * from './schemas';
