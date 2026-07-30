/**
 * A interface. Recebe dados prontos e não fala com a rede — o lint barra qualquer
 * import de `@model/*`, e desde a migração para Lit também não há o que buscar:
 * o ViewModel entrega rótulo, tom e opções, não DTO.
 *
 * TypeScript com **Lit**: `html\`\`` é _tagged template_, então não existe
 * compilador de interface no caminho e **não existe `.tsx` no projeto**.
 *
 * Três formas de arquivo, e a diferença entre elas é estado:
 *
 * - `components/` — funções `(props) => TemplateResult`. Executam e acabam.
 * - `islands/` — `*.island.ts`, classes que estendem
 *   {@link "src/view/core/island" | Island}. A única coisa da View que guarda
 *   estado, e só estado de interface (diálogo aberto, drawer visível).
 * - `screens/` — ligam o ViewModel aos componentes. Uma tela por rota.
 *
 * @packageDocumentation
 */
export * from './account';
export * from './auth';
export * from './containers';
export * from './core';
export * from './info';
export * from './metrics';
export * from './products';
export * from './roles';
export * from './users';
