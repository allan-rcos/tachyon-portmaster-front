/**
 * A interface. Recebe dados prontos e não fala com a rede — o lint barra qualquer
 * import de `@model/*`, e também não há o que buscar: o ViewModel entrega rótulo,
 * tom e opções, não DTO.
 *
 * JSX com **Solid**, compilado pelo `vite-plugin-solid`. A reatividade granular
 * do Solid não enxerga os `alien-signals` do ViewModel; quem faz a tradução é
 * {@link "src/view/core/observable/to-accessor" | toAccessor}, um arquivo só.
 *
 * Três formas de arquivo, e a diferença entre elas é estado:
 *
 * - `components/` — funções `(props) => JSX.Element`, sem estado.
 * - `islands/` — `*.island.tsx`. A única parte da View que guarda estado, e só
 *   estado de interface (diálogo aberto, drawer visível, observador ligado).
 *   Valor de formulário e "está enviando" NÃO moram aqui: são do ViewModel.
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
