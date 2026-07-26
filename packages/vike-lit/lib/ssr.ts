// ============================================================
//  Serialização de um template do Lit para HTML.
//
//  IMPORTANTE — só o caminho `lib/render-lit-html.js` do `@lit-labs/ssr` pode
//  ser importado. Ele puxa `lit`, `lit-html`, `@lit-labs/ssr-client`,
//  `@lit-labs/ssr-dom-shim`, `parse5` e `@parse5/tools`, todos JS puro. Estão
//  PROIBIDOS, porque arrastam Node built-ins que o txiki.js não tem:
//
//    @lit-labs/ssr                              → lib/dom-shim.js → node-fetch
//    @lit-labs/ssr/lib/install-global-dom-shim  → idem
//    @lit-labs/ssr/lib/module-loader.js         → enhanced-resolve
//    @lit-labs/ssr/lib/render-result-readable.js → 'stream'
//
//  O ESLint do projeto repete essa lista; aqui fica o porquê.
// ============================================================
import { customElements as customElementsShim } from '@lit-labs/ssr-dom-shim';
import { render as renderLit } from '@lit-labs/ssr/lib/render-lit-html.js';
import { collectResult, collectResultSync } from '@lit-labs/ssr/lib/render-result.js';

import type { Renderable } from '../types/Renderable.js';

// O `render-value.js` consulta `customElements.get()` no ramo de custom element.
// Nunca chegamos lá (a View não registra nenhum), mas o txiki não tem o global e
// a simples referência quebraria. O shim do próprio Lit resolve, sem depender do
// `install-global-dom-shim.js`, que é o que puxaria o `node-fetch`.
if (!('customElements' in globalThis)) {
  (globalThis as { customElements?: unknown }).customElements = customElementsShim;
}

/**
 * Serializa um template para HTML, resolvendo Promises pelo caminho.
 *
 * É o equivalente do `renderToStringAsync` do Solid — com a diferença de que
 * aqui não existe um `renderToString` que "perde" o assíncrono: este é o único
 * caminho, e ele sempre devolve HTML completo.
 */
export async function renderToString(value: Renderable): Promise<string> {
  return collectResult(renderLit(value));
}

/**
 * Versão síncrona. Lança se o template contiver Promise.
 *
 * Serve aos testes, que asseguram markup de SSR sem precisar de DOM.
 */
export function renderToStringSync(value: Renderable): string {
  return collectResultSync(renderLit(value));
}

/**
 * Serializa para um `ReadableStream` (Web).
 *
 * Escrito à mão em cima do iterável do `RenderResult` porque o
 * `render-result-readable.js` do Lit importa `stream` do Node.
 */
export function renderToWebStream(value: Renderable): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const result = renderLit(value)[Symbol.iterator]();

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      for (;;) {
        const next = result.next();
        if (next.done) {
          controller.close();
          return;
        }
        // Um chunk pode ser string ou Promise<string> — o Lit resolve dados
        // assíncronos emitindo a promise na posição onde o valor entra.
        const chunk = await next.value;
        if (typeof chunk === 'string' && chunk.length > 0) {
          controller.enqueue(encoder.encode(chunk));
          return;
        }
      }
    },
  });
}
