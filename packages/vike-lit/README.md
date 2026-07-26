# vike-lit

Ensina o Vike a renderizar [Lit](https://lit.dev). Ocupa exatamente o lugar que o
`vike-solid` ocupava: um objeto de config do Vike que declara `onRenderHtml`,
`onRenderClient` e o `meta` das configs de página.

```js
// pages/+config.js
import vikeLit from 'vike-lit/config';

export default {
  extends: [vikeLit],
  // …
};
```

## O contrato

```ts
// pages/painel/produtos/+Page.ts
export default function Page(pageContext: PageContext): PageView {
  const vm = createProductListVM(pageContext.data as ProductListPageInput);
  return () => ProductListScreen({ vm }); // thunk reavaliado a cada render
}

// pages/+Layout.ts
export default function Layout(pageContext: PageContext, children: Renderable): Renderable;

// pages/+Head.ts
export default function Head(pageContext: PageContext): Renderable;
```

Três diferenças deliberadas em relação ao `vike-solid`:

1. **A fábrica de `+Page` roda uma vez**, não a cada render. É onde o ViewModel
   é construído — e é o que faz o estado dele sobreviver aos re-renders.
2. **Não há hooks.** Nada de `useData()` / `usePageContext()`: o `pageContext`
   chega por argumento. Um `Layout` recebe `(pageContext, children)`.
3. **Um effect raiz**, não reatividade granular. `mountRoot` (em `lib/`) monta
   um `effect` do `alien-signals` que reavalia o template inteiro; quem decide o
   que toca o DOM é o diff do `lit-html`.

## Mapeamento contra o `vike-solid`

Referência: [`vikejs/vike-solid`](https://github.com/vikejs/vike-solid/tree/main/packages/vike-solid),
`packages/vike-solid` na `main` (lido em 2026-07-26, v0.8.3). Quando o upstream
mudar, o diff é arquivo a arquivo.

| vike-solid | LOC | aqui | o que mudou |
| --- | --- | --- | --- |
| `+config.ts` | 102 | `+config.ts` | mesmo objeto. Saíram `staticReplace` (hack do `createComponent`) e `vite.ssr.optimizeDeps`. |
| `integration/onRenderHtml.tsx` | 222 | `integration/onRenderHtml.ts` | `getHeadHtml`, `getTagAttributes`, `getViewportTag`, `mergeTagAttributesList`, `removeServerOnlyConfigFromHook`, `resolveStreamSetting` e o `escapeInject` do documento: **cópia literal**. Mudaram `getPageHtml` e `getHeadElementHtml`. `generateHydrationScript()` sumiu. |
| `integration/onRenderClient.tsx` | 59 | `integration/onRenderClient.ts` | mesma forma; `createStore` → `hydrate()` + `mountRoot`. |
| `integration/getPageElement.tsx` | 65 | `integration/getPageElement.ts` | reescrito em ~15 linhas. O `createStore`/`reconcile`/`createComputed` existia para preservar estado de wrapper entre navegações; aqui wrapper é função pura e o estado mora no ViewModel. |
| `integration/getHeadSetting.ts` | 32 | idem | literal. |
| `integration/applyHeadSettings.tsx` | 13 | `.ts` | literal (não tinha JSX). |
| `integration/ssrEffect.ts` | 21 | idem | literal. |
| `utils/*` (10 arquivos) | 90 | idem | literal. |
| `hooks/useConfig/configs*.ts` | 4 | idem | literal. |
| `types/{Config,PageContext}.ts` | 228 | idem + `types/Renderable.ts` | `JSX.Element` do Solid → `Renderable`; `Page` virou fábrica; `stream` perdeu o tipo `node`. |
| `components/ClientOnly.tsx` + `helpers/clientOnly.tsx` | 85 | `components/ClientOnly.ts` | ~30 linhas: um sinal `hydrated` em vez de componente + `staticReplace`. |
| `hooks/{usePageContext,useData,useHydrated}.tsx` | 88 | — | não portados: são hooks. |
| `hooks/useConfig/*` + `components/Config/*` | 119 | — | não portados: sem uso no projeto. |
| `vite-plugin-vike-solid.ts` + `with-solid.js` + `rollup.config.js` | 219 | — | desnecessários. O Lit não tem compilador: o build aqui é `tsc`. |
| — | — | `lib/ssr.ts` | serialização com `@lit-labs/ssr`. |
| — | — | `lib/renderRoot.ts` | o effect raiz. |

Uma correção em relação ao original: `resolveStreamSetting` usa
`stream.slice().reverse()`. O `vike-solid` chama `.reverse()` direto no array da
config, que muta o `pageContext.config.stream` a cada requisição.

## Streaming

Só Web Stream. O `node` exigiria o `stream` do Node, que o runtime alvo
(txiki.js) não tem — e `@lit-labs/ssr/lib/render-result-readable.js`, que seria o
caminho natural, importa justamente esse módulo. `lib/ssr.ts` monta o
`ReadableStream` à mão em cima do iterável do `RenderResult`.

## Imports proibidos do `@lit-labs/ssr`

Só `lib/render-lit-html.js` e `lib/render-result.js` podem ser usados. Estes
arrastam Node built-ins e estão barrados (também pelo ESLint do projeto):

| caminho | arrasta |
| --- | --- |
| `@lit-labs/ssr` (raiz) | `lib/dom-shim.js` → `node-fetch` |
| `lib/install-global-dom-shim.js` | idem |
| `lib/module-loader.js` | `enhanced-resolve` |
| `lib/render-result-readable.js` | `stream` |

O `customElements` que o `render-value.js` consulta vem do
`@lit-labs/ssr-dom-shim` (JS puro), instalado no topo de `lib/ssr.ts`.
