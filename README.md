# Tachyon PortMaster

Frontend SSR do sistema de alocação de contêineres e carga. **[Vike](https://vike.dev)**

- **[SolidJS](https://www.solidjs.com)**, servido em produção pelo
  **[txiki.js](https://github.com/saghul/txiki.js)** (`tjs`) — um runtime minúsculo
  (QuickJS + libuv) que cumpre o padrão WinterTC.

O **Bun** é usado só para **gerenciar pacotes** e **compilar**. Ele não serve
nada em produção.

---

## Arquitetura

O projeto é **MVVM**, com uma regra de dependência que só aponta para baixo:

```
pages/  →  src/view/  →  src/viewmodel/  →  src/model/
(Vike)     (interface)   (lógica)           (dados)
```

Cada camada só enxerga a de baixo. A regra **não é convenção**: está aplicada no
`eslint.config.mjs` e falha o build quando violada.

| Camada          | Responsabilidade                           | Não pode                              |
| --------------- | ------------------------------------------ | ------------------------------------- |
| `src/model`     | falar com as fontes de dados               | conhecer Vike, Solid, i18n ou DOM     |
| `src/viewmodel` | lógica, estado observável, i18n, validação | conhecer JSX, Vike ou Solid           |
| `src/view`      | interface                                  | falar com a rede ou importar `@model` |
| `pages`         | integrar o Vike (rotas, guard, `<head>`)   | ter CSS, markup ou lógica             |

O que isso compra na prática:

- **mover uma tela entre servidor e cliente é uma decisão de uma linha** — o
  `VMContext` escolhe o lado pela presença de `headers`, e o ViewModel não muda;
- **o ViewModel é testável sem DOM, sem Vike e sem rede** — recebe `PageRequest`,
  um objeto literal;
- **a interface não alcança a rede por construção** — ela só enxerga o submódulo
  `dto` do Model, que não contém funções.

Detalhes e o porquê de cada decisão em
[`docs/architecture/mvvm.md`](docs/architecture/mvvm.md).

### Mapa do repositório

```
src/
  model/        camada de dados (recursos da API, contrato swagger, codecs)
  viewmodel/    queries, mutations, schemas, i18n, observables
  view/         componentes, islands, telas e estilos
  testing/      factories e infra de teste
pages/          composition root do Vike — só arquivos `+`
packages/
  tachyon-design/           submodule: design system (SASS)
  tachyon-portmaster-i18n/  catálogos, projeto inlang e validador
  vike-txiki-adapter/       submodule: adapter do Vike para o txiki
docs/           arquitetura, guias e protótipo
dist/           build (inclui a saída do compilador i18n)
```

### Como o build funciona

```
                    ┌──────── vite build (sob Bun) ────────┐
  pages/ + src/  ─►  vike  ─►  dist/server/entry.mjs        │
                              dist/client/**  (assets)      │
                                     │                      │
       plugin txiki()  ◄─────────────┘  (no closeBundle)    │
                    │                                        │
                    ▼                                        │
             dist/txiki/server.mjs  ──►  tjs  (produção)
```

`dist/txiki/server.mjs` é **um arquivo só** de propósito: o txiki não resolve
bare specifiers nem `node_modules`. Nenhum arquivo de fiação fica no projeto —
o build e o adapter fazem tudo.

---

## Começando

### Pré-requisitos

- **[Bun](https://bun.sh)** — pacotes e build
- **[txiki.js](https://github.com/saghul/txiki.js) (`tjs`)** — só para rodar o
  build localmente; com Docker, não é necessário

<details>
<summary>Instalar o txiki.js no Linux (compilar do fonte)</summary>

Não há binário Linux publicado:

```bash
sudo apt install build-essential clang cmake ninja-build pkg-config \
                 libffi-dev libcurl4-openssl-dev

git clone --recursive --shallow-submodules --depth 1 --branch v26.6.0 \
  https://github.com/saghul/txiki.js ~/.local/src/txiki.js
cd ~/.local/src/txiki.js
CC=clang make
cp build/tjs ~/.local/bin/tjs   # garanta ~/.local/bin no PATH
tjs --version
```

Use **clang**: o fonte usa `#pragma region`, que o gcc não conhece e que, sob o
`-Werror` do projeto, aborta a compilação. No macOS e no Windows há binários
prontos nas [releases](https://github.com/saghul/txiki.js/releases).

</details>

### Rodando

```bash
git clone --recurse-submodules git@github.com:allan-rcos/tachyon-portmaster-front.git
cd tachyon-portmaster-front
bun install
cp .env.example .env

bun run dev      # http://localhost:3000
```

Clonou sem `--recurse-submodules`? `git submodule update --init --recursive`.

---

## Comandos

| Comando                | O que faz                                  |
| ---------------------- | ------------------------------------------ |
| `bun run dev`          | Vite + HMR                                 |
| `bun run build`        | build de produção completo                 |
| `bun run start`        | roda o build com `tjs`                     |
| `bun run test`         | suíte de testes                            |
| `bun run lint`         | camadas, JSDoc e ordem de import           |
| `bun run typecheck`    | `tsc --noEmit`                             |
| `bun run i18n:check`   | contrato de tradução nos 3 locales         |
| `bun run i18n:compile` | compila os catálogos para `dist/paraglide` |
| `bun run docs:api`     | referência TypeDoc em `docs/api`           |
| `bun run gen:fbs`      | regenera os codecs FlatBuffers             |

Antes de abrir um PR: `lint`, `typecheck`, `i18n:check`, `test` e `build`.

---

## Docker

```bash
docker build -t portmaster .
docker run --rm -p 3000:3000 portmaster
```

Imagem final ~98 MB: Debian slim com o `tjs` e o `dist`, rodando como usuário
não-root. Sem Bun, sem `node_modules`, sem código-fonte.

Há também um `Dockerfile.dist`, que empacota um `dist/` já construído — é o que
o CI usa para não compilar a aplicação duas vezes. Ver
[`docs/guides/devops.md`](docs/guides/devops.md).

---

## Release

O gatilho é a **mudança da versão no `package.json`** na `main`, não uma tag
manual. O workflow revalida tudo e publica dois artefatos do mesmo build:

- `portmaster-dist-vX.Y.Z.zip` — o `dist` pronto para rodar;
- `ghcr.io/allan-rcos/portmaster:X.Y.Z` e `:latest`.

```bash
# edite "version" no package.json
git commit -am "chore: v0.2.0" && git push
```

---

## Documentação

Comece por [`docs/`](docs/README.md).

- [Arquitetura MVVM](docs/architecture/mvvm.md)
- [Criar uma feature do zero](docs/guides/add-feature.md)
- [Adicionar uma página](docs/guides/add-page.md)
- [Adicionar uma fonte de dados](docs/guides/add-model-source.md)
- [i18n](docs/guides/i18n.md) · [Estilos](docs/guides/styling.md) ·
  [Testes](docs/guides/testing.md) · [DevOps](docs/guides/devops.md)

Cada camada também tem README junto do código:
[model](src/model/README.md) · [viewmodel](src/viewmodel/README.md) ·
[view](src/view/README.md) · [testing](src/testing/README.md).

---

## Notas de runtime

- O único `node:` no caminho do Vike é um `import('node:async_hooks')` dinâmico
  e protegido por try/catch — no txiki ele falha e degrada de forma transparente.
- A CLI do adapter força `NODE_ENV=production` e **não** usa `--minify` ao
  empacotar: há um bug do Bun que tenta resolver um `require` morto do
  `@babel/core`, puxado só pelo toolchain.
- As telas de `/painel` renderizam no navegador; o servidor só executa o guard
  de autenticação e permissões. As rotas públicas seguem em SSR com dados.
