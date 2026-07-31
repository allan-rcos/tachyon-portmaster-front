/**
 * As peças transversais do ViewModel: cliente resolvido por ambiente, sessão e
 * permissões, contrato de página, i18n e utilitários de formatação.
 *
 * O que entra aqui é o que mais de uma feature usa **e** que não é vocabulário de
 * dados (isso é {@link "src/model/common" | @model/common}).
 *
 * @packageDocumentation
 */
export * from './error-page.vm';
export * from './client';
export * from './i18n';
export * from './page';
export * from './schemas';
export * from './session';
export * from './testing';
export * from './utils';
