// ============================================================
//  O laço de render do cliente — a peça que substitui, de uma vez, o
//  `to-accessor`/`bind-mutation` da View e o `createStore`/`reconcile` que o
//  `vike-solid` precisa no `getPageElement`.
//
//  Um effect só. `view()` reavalia o template inteiro da página, e ao fazê-lo
//  LÊ todo getter de ViewModel usado ali — é assim que o `alien-signals`
//  rastreia a dependência. A granularidade fina não se perde: quem decide o que
//  toca o DOM é o diff do `lit-html`, que só reescreve as parts que mudaram.
// ============================================================
import { effect } from 'alien-signals';
import { render } from 'lit';

import type { PageView, Renderable } from '../types/Config.js';

/**
 * Liga o template da página ao DOM e mantém os dois em sincronia.
 *
 * A primeira passada é síncrona (o DOM precisa existir antes de a função
 * retornar); as seguintes são agendadas num `queueMicrotask`, o que coalesce
 * várias escritas de sinal do mesmo handler num único `render`.
 *
 * @param view      Thunk do template, vindo de `getPageView`.
 * @param container Nó raiz — o `<div id="root">` que o `onRenderHtml` emitiu.
 * @returns Descarta o effect. Chamar antes de montar outra página.
 */
export function mountRoot(view: PageView, container: HTMLElement): () => void {
  let first = true;
  let scheduled = false;
  let latest: Renderable;

  const flush = () => {
    scheduled = false;
    render(latest, container);
  };

  return effect(() => {
    latest = view();
    if (first) {
      first = false;
      render(latest, container);
      return;
    }
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(flush);
  });
}
