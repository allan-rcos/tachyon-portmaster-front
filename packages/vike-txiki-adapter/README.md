# vike-txiki-adapter

Adapter agnóstico para servir um build de produção do [Vike](https://vike.dev)
no runtime [txiki.js](https://github.com/saghul/txiki.js) (`tjs`) — um runtime
minúsculo (QuickJS + libuv) que cumpre o [WinterTC](https://wintercg.org).

Não conhece nada do seu projeto nem do seu framework de UI (Solid, React,
Vue…): ele apenas adapta `Request → renderPage(Vike) → Response` e serve os
assets estáticos do build. Funciona para qualquer app Vike.

## Como funciona

O runtime de produção do Vike (`dist/server`, condição de export `worker`) é
Web-standard: `renderPage` não lê o disco (o manifest é embutido em
`dist/server/entry.mjs`) e não usa APIs reais do Node. Este adapter só liga
esse `renderPage` ao servidor HTTP nativo do txiki.js (`tjs.serve`).

Como o txiki.js não resolve _bare specifiers_ nem `node_modules`, é preciso
empacotar num único arquivo antes de rodar no `tjs`. Há três formas de fazer
isso — **nenhuma exige um arquivo de fiação (`entry.js`) no seu projeto**: um
**plugin de Vite**, uma **CLI** ou a **API programática**.

O empacotamento gera um _entry_ efêmero (ligando `dist/server/entry.mjs` +
`vike/server` + este adapter), roda `Bun.build` (`NODE_ENV=production`,
`--target=node`, condição `worker`, sem `--minify`) e escreve
`dist/txiki/server.mjs` — portável (localiza os assets via `import.meta.url`).
Requer **Bun** para empacotar e **`tjs`** no PATH para servir.

## Uso (plugin de Vite) — recomendado

Um único `vite build` já produz `dist/txiki/server.mjs` (o plugin engata no
`closeBundle`, como um adapter do SvelteKit/Nuxt):

```ts
// vite.config.ts
import { txiki } from 'vike-txiki-adapter/vite';

export default {
  plugins: [vike(), /* seu framework, ex.: vikeSolid(), */ txiki()]
};
```

```json
{
  "scripts": {
    "build": "vite build",
    "start": "vike-txiki-adapter start"
  }
}
```

> O plugin usa `Bun.build`. Se o `vite build` rodar sob Bun (ex.:
> `bunx --bun vite build`), empacota no mesmo processo; sob Node, ele delega ao
> binário `bun` automaticamente.

`txiki(options)` aceita as mesmas opções da CLI (`entry`, `client`, `out`,
`port`, `cwd`).

## Uso (CLI)

Com o build do Vike já gerado:

```bash
vike-txiki-adapter build   # gera dist/txiki/server.mjs
vike-txiki-adapter start   # roda o bundle no txiki.js (tjs); builda se faltar
```

### Opções (CLI)

| Opção          | Default                  | Descrição |
|----------------|--------------------------|-----------|
| `--entry <p>`  | `dist/server/entry.mjs`  | Entry SSR do Vike. |
| `--client <p>` | `dist/client`            | Dir de assets estáticos. |
| `--out <p>`    | `dist/txiki/server.mjs`  | Bundle de saída. |
| `--port <n>`   | `3000`                   | Porta padrão (o env `PORT` tem prioridade). |

## Uso (programático) — avançado

Para embutir em seu próprio entry/servidor:

```js
import '../dist/server/entry.mjs';
import { renderPage } from 'vike/server';
import { serve } from 'vike-txiki-adapter';

serve({ renderPage, staticDir: new URL('../client/', import.meta.url), port: 3000 });
```

> Empacote com `NODE_ENV=production bun build … --target=node --conditions worker`.
> **Não** use `--minify` (bug do Bun resolvendo um `require` morto do `@babel/core`).

## API

### `serve(options)`
Sobe `tjs.serve` e retorna o servidor (`{ port }`).

### `createFetchHandler(options) => (Request) => Promise<Response>`
Retorna só o handler `fetch` Web-standard (sem depender do `tjs.serve`), útil
para testes ou para outros servidores WinterTC.

### `options`
| Campo        | Tipo                     | Default              | Descrição |
|--------------|--------------------------|----------------------|-----------|
| `renderPage` | `RenderPage`             | — (obrigatório)      | Importado de `vike/server`. |
| `staticDir`  | `URL \| string`          | `undefined`          | Base dos assets (`dist/client`). Omitido = nada estático. |
| `port`       | `number`                 | `tjs.env.PORT` ou 3000 | Porta HTTP. |
| `mimeTypes`  | `Record<string, string>` | `{}`                 | Overrides do mapa de MIME. |

## Build do pacote

```bash
bun run build   # bun build -> dist/{index,cli,vite}.mjs  +  tsc -> dist/*.d.ts
```
