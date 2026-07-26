import { nothing } from 'lit';
import type { PageContext } from 'vike/types';

import type { PageView, Renderable } from '../types/Config.js';

/**
 * Constrói o thunk do template da página, já embrulhado por `Layout`/`Wrapper`.
 *
 * A fábrica de `+Page.ts` é chamada **uma vez** — é ela que constrói o
 * ViewModel. O thunk devolvido é o que o laço de render reavalia, e é por isso
 * que o estado do VM sobrevive aos re-renders.
 *
 * No `vike-solid` o equivalente (`getPageElement.tsx`) precisa de
 * `createStore` + `reconcile` + `createComputed` para preservar o estado dos
 * wrappers entre navegações. Aqui não há o que preservar: o wrapper é uma
 * função pura de `(pageContext, children)`, e o estado mora no ViewModel.
 */
export function getPageView(pageContext: PageContext): PageView {
  const pageView: PageView = pageContext.Page ? pageContext.Page(pageContext) : () => nothing;

  // Ordem igual à do vike-solid: `Layout` embrulha por dentro, `Wrapper` por
  // fora, e dentro de cada grupo o primeiro da lista é o mais interno.
  const wrappers = [...(pageContext.config.Layout ?? []), ...(pageContext.config.Wrapper ?? [])];
  if (wrappers.length === 0) return pageView;

  return () =>
    wrappers.reduce<Renderable>((children, wrap) => wrap(pageContext, children), pageView());
}
