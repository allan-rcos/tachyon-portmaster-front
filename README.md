# Tachyon PortMaster

Frontend SSR do sistema de alocação de contêineres e carga. **[Vike](https://vike.dev)**

- **[Lit](https://lit.dev)**, servido em produção pelo
  **[txiki.js](https://github.com/saghul/txiki.js)** (`tjs`) — um runtime minúsculo
  (QuickJS + libuv) que cumpre o padrão WinterTC.

A integração de interface é nossa: [`vike-lit`](https://github.com/allan-rcos/vike-lit),
que espelha a arquitetura do `vike-solid` oficial e entra aqui como submodule em
`packages/vike-lit`. **Não há `.tsx` no projeto** — `html\`\`` do Lit é
_tagged template_, então a View é TypeScript que se importa e roda, sem
compilador de interface no caminho.

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
| `src/model`     | falar com as fontes de dados               | conhecer Vike, Lit, i18n ou DOM       |
| `src/viewmodel` | lógica, estado, i18n, validação, formatação | conhecer Vike, Lit ou DOM            |
| `src/view`      | interface                                  | falar com a rede ou importar `@model` |
| `pages`         | integrar o Vike (rotas, guard, `<head>`)   | ter CSS, markup ou lógica             |

O que isso compra na prática:

- **trocar o motor de interface não tocou a lógica** — a migração de Solid para
  Lit passou pelos 190 testes de ViewModel sem alterar um deles;
- **o ViewModel é testável sem DOM, sem Vike e sem rede** — recebe `PageRequest`,
  um objeto literal, e isso vale até para os nove formulários;
- **a interface não alcança a rede por construção** — ela só enxerga o submódulo
  `dto` do Model, que não contém funções.

Detalhes e o porquê de cada decisão em
[`docs/architecture/mvvm.md`](docs/architecture/mvvm.md).

### Mapa do repositório

```
src/
  model/        camada de dados (recursos da API, contrato swagger, codecs)
  viewmodel/    queries, mutations, schemas, i18n, ViewModels de rota
  view/         componentes, islands, telas e estilos
pages/          composition root do Vike — só arquivos `+`
packages/
  tachyon-design/           submodule: design system (SASS)
  tachyon-portmaster-i18n/  catálogos, projeto inlang e validador
  vike-lit/                 integração de interface do Vike (nossa)
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

A fonte da verdade é a **versão no `package.json`**, não uma tag manual. Todo
push na `main` pergunta se a tag `v<version>` já existe; se não existe, esta é
a release. O workflow revalida tudo e publica dois artefatos do mesmo build:

- `portmaster-dist-vX.Y.Z.zip` — o `dist` pronto para rodar, mais o `.sha256`;
- `ghcr.io/allan-rcos/portmaster:X.Y.Z` e `:latest`.

O zip leva só `client/` e `txiki/server.mjs`: `server/`, `fbs/` e `paraglide/`
são entrada de build, já embutidas no bundle.

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
[view](src/view/README.md) · [vike-lit](packages/vike-lit/README.md).

---

## Notas de runtime

- O único `node:` no caminho do Vike é um `import('node:async_hooks')` dinâmico
  e protegido por try/catch — no txiki ele falha e degrada de forma transparente.
- A CLI do adapter força `NODE_ENV=production` e **não** usa `--minify` ao
  empacotar: há um bug do Bun que tenta resolver um `require` morto do
  `@babel/core`, puxado só pelo toolchain.
- As telas de `/painel` renderizam no navegador; o servidor só executa o guard
  de autenticação e permissões. As rotas públicas seguem em SSR com dados.
