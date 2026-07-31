/**
 * A lógica da aplicação. TypeScript puro: **zero Vike, zero Lit, zero DOM** — e o
 * lint verifica, não é convenção.
 *
 * É a camada que decide. Recebe {@link "src/viewmodel/core/page" | PageRequest} do
 * composition root, fala com o {@link "src/model" | Model}, valida com Zod, resolve
 * o catálogo de texto para o locale, e entrega à View dado de **apresentação** —
 * rótulo, tom, opções — nunca DTO.
 *
 * Cada rota expõe dois papéis no seu `*.vm.ts`: `createXPageInput` (roda no
 * `+data`, dos dois lados, antes do render) e `createXVM` (a reatividade, em
 * `signal` do alien-signals).
 *
 * @packageDocumentation
 */
export * from './account';
export * from './auth';
export * from './containers';
export * from './core';
export * from './metrics';
export * from './products';
export * from './roles';
export * from './system';
export * from './users';
