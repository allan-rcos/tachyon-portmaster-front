/**
 * Camada de dados. Sabe falar com a API e nada mais: não conhece Vike, Lit, i18n
 * nem DOM — e o lint barra qualquer import nessa direção.
 *
 * Esta raiz expõe só o que é transversal: o transporte ({@link "src/model/core" | core})
 * e o vocabulário compartilhado ({@link "src/model/common" | common}). Cada recurso
 * é importado pelo próprio subpath (`@model/containers`) para máximo tree-shaking.
 *
 * @packageDocumentation
 */
export * from './core';
export * from './common';
