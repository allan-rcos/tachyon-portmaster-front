# Tachyon PortMaster

BFF SSR construída com **[Vike](https://vike.dev)** + **[SolidJS](https://www.solidjs.com)**,
projetada para ser **WinterTC** (não depende do Node). O servidor oficial de
produção roda no **[txiki.js](https://github.com/saghul/txiki.js)** (`tjs`) — um
runtime minúsculo (QuickJS + libuv) que cumpre o padrão WinterTC.

O **Bun** é usado apenas para **gerenciar pacotes** e **compilar** (build). Ele
não serve nada em produção.

---

## Arquitetura

O projeto contém **apenas `pages/`** (código-fonte). Não há nenhum arquivo de
fiação/servidor: o build do Vike + o pacote `vike-txiki-adapter` fazem todo o
resto.

```
                    ┌──────── vite build (sob Bun) ────────┐
  pages/**  ─►  vike  ─►  dist/server/entry.mjs             │
                          dist/client/**  (assets)          │
                                     │                      │
       plugin txiki()  ◄─────────────┘  (no closeBundle)    │
                    │                                        │
                    ▼                                        │
             dist/txiki/server.mjs  ──►  tjs  (servidor oficial)
```

1. **`vite build`** (via Bun) gera o build do Vike:
   - `dist/server/entry.mjs` — runtime SSR do Vike com o _global context_
     (page configs + manifest) **embutido**, sem ler o disco e sem APIs reais
     do Node (condição de export `worker` = WinterTC).
   - `dist/client/**` — assets do navegador (JS/CSS com hash).
2. **O plugin `txiki()`** (de `vike-txiki-adapter/vite`, no `vite.config.ts`)
   engata no `closeBundle`: gera um _entry_ efêmero ligando `entry.mjs` +
   `renderPage` (de `vike/server`) + o adapter, e o empacota com `Bun.build`
   num único **`dist/txiki/server.mjs`** — porque o txiki.js não resolve _bare
   specifiers_ nem `node_modules`. **Nenhum arquivo de fiação fica no projeto.**
   (A mesma lógica está na CLI `vike-txiki-adapter build`, como alternativa.)
3. **`tjs`** roda o bundle. O adapter usa `tjs.serve({ fetch })` — mesmo formato
   Web-standard do Bun/Cloudflare Workers.

> O `vite build` roda sob o Bun (`bunx --bun vite build`) para o plugin ter
> acesso ao `Bun.build`.

O adapter é um pacote independente e **agnóstico de implementação** (serve
qualquer app Vike, com qualquer framework de UI). Veja
[`packages/vike-txiki-adapter`](packages/vike-txiki-adapter/README.md).

---

## Pré-requisitos

- **[Bun](https://bun.sh)** — pacotes e build.
- **[txiki.js](https://github.com/saghul/txiki.js) (`tjs`)** — runtime do servidor.

### Instalando o txiki.js

Não há binário pré-compilado para Linux; compile do fonte (precisa de
`git`, `cmake`, `ninja` e um compilador C):

```bash
git clone --recursive --shallow-submodules --depth 1 \
  https://github.com/saghul/txiki.js ~/.local/src/txiki.js
cd ~/.local/src/txiki.js
make
cp build/tjs ~/.local/bin/tjs   # garanta que ~/.local/bin está no PATH
tjs --version                   # ex.: v26.6.0
```

No macOS/Windows há binários prontos nas
[releases](https://github.com/saghul/txiki.js/releases).

---

## Comandos

```bash
bun install       # instala deps e linka o workspace do adapter

bun run dev       # desenvolvimento: Vite + HMR  (http://localhost:3000)

bun run build     # build de produção completo:
                  #   1) build:adapter -> compila vike-txiki-adapter (lib + CLI + plugin)
                  #   2) vite build    -> dist/server + dist/client E, via plugin txiki(),
                  #                        dist/txiki/server.mjs  (tudo num único build)

bun run start     # servidor oficial de produção:  vike-txiki-adapter start (tjs)
                  #   PORT=8080 bun run start  para trocar a porta
```

> Rodou `bun run start` sem buildar antes? Rode `bun run build` primeiro.

---

## Estrutura

```
pages/
  +config.js            Config global do Vike (vike-solid, título, redirects)
  info/
    +Page.tsx           Tela de info (componente Solid)
    +data.ts            Hook de dados do SSR (detecta o runtime: txiki/Bun/…)
    Page.scss           Estilos (compilados pelo Vite via sass)
  _error/
    +Page.tsx           Página de erro (404 / 500)

packages/
  vike-txiki-adapter/   Pacote independente e agnóstico (o adapter + CLI oficial)

vite.config.ts          Vite + vike + vike-solid
```

O projeto **não tem** arquivo de servidor/fiação: `pages/` + o build + o adapter
bastam.

Rotas: `/` → redireciona para `/info`; `/info` é a tela renderizada por SSR.

---

## Notas / detalhes

- A CLI `vike-txiki-adapter build` já cuida de dois detalhes do Bun ao
  empacotar: força **`NODE_ENV=production`** (senão o Vike emite aviso de
  ambiente de dev) e **não usa `--minify`** (há um bug do Bun que tenta resolver
  um `require` morto do `@babel/core`, puxado só pelo toolchain).
- O único `node:` no caminho de runtime do Vike é um `import('node:async_hooks')`
  **dinâmico e protegido por try/catch** — no txiki ele falha e degrada de forma
  transparente.
- A memória exibida na tela usa `process.memoryUsage()` quando disponível; no
  txiki cai no _fallback_ (o shim de `process` do Bun não expõe RSS).
