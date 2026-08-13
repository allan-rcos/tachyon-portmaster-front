# Tachyon PortMaster

**Frontend SSR do pátio de contêineres, em Lit sobre Vike, servido em produção por um runtime de 2 MB que não é o Node.**

Produtos são catalogados, contêineres são registrados e a carga é conferida contra um manifesto — esta é a interface por onde isso acontece. As telas públicas e o guard de autenticação renderizam no servidor; o painel hidrata no navegador, e só as ilhas que precisam.

O projeto é uma **base de MVVM com regra de dependência aplicada pelo linter**, não combinada em reunião: a View não alcança a rede, o ViewModel não conhece Vike nem DOM, e um import na direção errada quebra o build. A migração de Solid para Lit atravessou os 189 testes de ViewModel sem que um único fosse alterado — é essa a prova de que a separação existe.

[![CI](https://img.shields.io/github/actions/workflow/status/allan-rcos/tachyon-portmaster-front/ci.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=CI)](https://github.com/allan-rcos/tachyon-portmaster-front/actions/workflows/ci.yml)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Lit](https://img.shields.io/badge/Lit-324FFF?style=for-the-badge&logo=lit&logoColor=white)
![Vike](https://img.shields.io/badge/Vike-CE3B3B?style=for-the-badge&logo=vite&logoColor=white)
![txiki.js](https://img.shields.io/badge/txiki.js-1F6FEB?style=for-the-badge&logo=javascript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![FlatBuffers](https://img.shields.io/badge/FlatBuffers-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Apache-2.0](https://img.shields.io/badge/Apache--2.0-green?style=for-the-badge)

-----

## ✨ Destaques

* **SSR num runtime de 2 MB.** Produção roda no [txiki.js](https://github.com/saghul/txiki.js) (`tjs`) — QuickJS + libuv, padrão WinterTC — e não no Node. O Bun aparece só para instalar pacotes e compilar; ele não serve nada.
* **A regra de dependência é código.** `pages → view → viewmodel → model`, aplicada por quatro zonas de `no-restricted-imports` no `eslint.config.mjs`. Convenção documentada é convenção violada; esta falha o `dagger call lint`.
* **Sem compilador de interface.** Não existe `.tsx` no projeto: `` html`` `` do Lit é *tagged template*, então a View é TypeScript que se importa e roda. A integração com o Vike é nossa — [`vike-lit`](https://github.com/allan-rcos/vike-lit), espelhando a arquitetura do `vike-solid` oficial.
* **O ViewModel é testável sem DOM, sem Vike e sem rede.** Ele recebe um `PageRequest`, que é objeto literal — e isso vale inclusive para os nove formulários. São 41 arquivos e 189 testes que não sobem navegador.
* **Ilhas, não hidratação total.** 18 rotas e 14 ilhas: o servidor entrega HTML e só o que é interativo acorda no cliente.
* **FlatBuffers no fio, JSON quando convém.** Os codecs saem por `flatc` dos schemas do submódulo `swagger/`, os mesmos que o backend usa — o contrato é um arquivo, não um acordo.
* **i18n com contrato verificado.** Três locales (`pt-BR`, `en`, `es`) compilados pelo Paraglide, e um `i18n:check` que reprova o build quando uma chave exigida falta em qualquer um deles.
* **Um artefato, dois destinos.** O mesmo build vira o zip da release e a imagem GHCR, podado para o que de fato roda: 5,9 MB de `dist` viram 3,4 MB.

-----

## 🏗️ Arquitetura

MVVM com uma regra de dependência que só aponta para baixo:

```
pages/  →  src/view/  →  src/viewmodel/  →  src/model/
(Vike)     (interface)   (lógica)           (dados)
```

| Camada          | Responsabilidade                            | Não pode                              |
| --------------- | ------------------------------------------- | ------------------------------------- |
| `src/model`     | falar com as fontes de dados                | conhecer Vike, Lit, i18n ou DOM       |
| `src/viewmodel` | lógica, estado, i18n, validação, formatação | conhecer Vike, Lit ou DOM             |
| `src/view`      | interface                                   | falar com a rede ou importar `@model` |
| `pages`         | integrar o Vike (rotas, guard, `<head>`)    | ter CSS, markup ou lógica             |

A interface não alcança a rede **por construção**: ela só enxerga o submódulo `dto` do Model, que não contém funções. Não é disciplina, é o que o import permite.

O porquê de cada decisão está em [`docs/architecture/mvvm.md`](docs/architecture/mvvm.md).

### Mapa do repositório

```
src/
  model/        camada de dados (recursos da API, contrato swagger, codecs)
  viewmodel/    queries, mutations, schemas, i18n, ViewModels de rota
  view/         componentes, ilhas, telas e estilos
pages/          composition root do Vike — só arquivos `+`
packages/
  tachyon-design/           submodule: design system (SASS)
  tachyon-portmaster-i18n/  catálogos, projeto inlang e validador
  vike-lit/                 submodule: integração de interface do Vike (nossa)
  vike-txiki-adapter/       submodule: adapter do Vike para o txiki
docs/           arquitetura, guias e protótipo
dist/           build (inclui as saídas de compilador i18n e FlatBuffers)
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

`dist/txiki/server.mjs` é **um arquivo só** de propósito: o txiki não resolve bare specifiers nem `node_modules`. Se um `import` de pacote sobrevivesse ao bundle, o serviço quebraria no boot e não no build.

> **Ao mexer no adapter:** a CLI força `NODE_ENV=production` e **não** usa `--minify`. Há um bug do Bun que, com minificação, tenta resolver um `require` morto do `@babel/core` — puxado só pelo toolchain, nunca executado.

> O único `node:` no caminho do Vike é um `import('node:async_hooks')` dinâmico e protegido por try/catch. No txiki ele falha e degrada de forma transparente; é isso que permite o Vike rodar fora do Node.

-----

## 🌐 Rotas

| Área | Rotas |
|---|---|
| **Públicas** | `/entrar` · `/info` |
| **Painel** | `/painel` · `/painel/conta` |
| **Produtos** | `/painel/produtos` · `/painel/produtos/nova` · `/painel/produtos/{id}/editar` |
| **Contêineres** | `/painel/conteineres` · `/painel/conteineres/nova` · `/painel/conteineres/{id}` · `/painel/conteineres/{id}/editar` |
| **Usuários** | `/painel/usuarios` · `/painel/usuarios/nova` · `/painel/usuarios/{id}/editar` |
| **Perfis** | `/painel/perfis` · `/painel/perfis/nova` · `/painel/perfis/{id}/permissoes` |

As telas de `/painel` renderizam no navegador; o servidor executa só o guard de autenticação e permissões. As rotas públicas seguem em SSR com dados.

-----

## 🛠️ Instalação

### Requisitos

| | |
|---|---|
| **[Bun](https://bun.sh)** | pacotes e build; é o único obrigatório para desenvolver |
| **[txiki.js](https://github.com/saghul/txiki.js) (`tjs`)** | apenas para rodar o build de produção localmente — com Docker, dispensável |
| **[flatc](https://github.com/google/flatbuffers) 25.12+** | apenas para regerar os codecs FlatBuffers |

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

Use **clang**: com gcc a compilação aborta a 92%, nos `#pragma region` que ele não conhece. No macOS e no Windows há binários prontos nas [releases](https://github.com/saghul/txiki.js/releases).

</details>

### 1. Clone com submódulos

São quatro, e um deles — `packages/tachyon-design` — é privado. Sem eles não há design system, integração Lit, adapter nem schemas para gerar.

```bash
git clone --recurse-submodules git@github.com:allan-rcos/tachyon-portmaster-front.git
cd tachyon-portmaster-front
```

Já clonou sem eles? `git submodule update --init --recursive`.

### 2. Instale e configure

```bash
bun install
cp .env.example .env
```

| Variável | Papel |
|---|---|
| `PUBLIC_ENV__API_BASE_URL` | base das chamadas do navegador (padrão `/api`) |
| `PUBLIC_ENV__API_SERVER_URL` | base loopback do SSR para a API em Rust |
| `PORT` | porta do servidor (padrão `3000`) |

> O prefixo `PUBLIC_ENV__` expõe a variável ao bundle do cliente — **nunca use para segredo**.

-----

## 🚀 Uso

### Desenvolvimento

```bash
bun run dev      # http://localhost:3000
```

### Produção, na sua máquina

```bash
dagger call build
bun run start    # roda dist/txiki/server.mjs no tjs
```

### Docker

```bash
docker build -t portmaster .
docker run --rm -p 3000:3000 portmaster
```

Imagem final ~98 MB: Debian slim com o `tjs` e o `dist`, rodando como usuário não-root. Sem Bun, sem `node_modules`, sem código-fonte. Há também um `Dockerfile.dist`, que empacota um `dist/` já construído — é o que o CI usa para não compilar a aplicação duas vezes.

-----

## ✅ Qualidade

| Comando | O que faz |
|---|---|
| `dagger call lint` | camadas, JSDoc e ordem de import |
| `dagger call typecheck` | `tsc --noEmit` |
| `dagger call test` | 41 arquivos, 189 testes (Vitest + jsdom) |
| `dagger call check-translations` | contrato de tradução nos três locales |
| `dagger call build` | build de produção completo |
| `bun run docs:api` | referência TypeDoc em `docs/api` |
| `bun run gen:fbs` | regenera os codecs FlatBuffers |

**Onde os testes batem:** no ViewModel, porque é onde as regras existem — validação, estado, formatação e os nove formulários. Nada disso precisa de navegador, e é por isso que a suíte inteira roda em segundos. A View é exercitada pelo `typecheck` e pelo build; o que ela tem de próprio é markup.

O CI ([GitHub Actions](.github/workflows/ci.yml)) roda a ordem barata primeiro — i18n, lint, tipos, testes, build, TypeDoc — para um erro de lint não custar um build inteiro para aparecer.

-----

## 🚢 Release

A fonte da verdade é a **versão no `package.json`**, não uma tag empurrada à mão. Todo push na `main` pergunta ao remoto se a tag `v<version>` já existe; se não existe, esta é a release.

```bash
# edite "version" no package.json
git commit -am "chore: v1.1.0" && git push
```

A condição é a ausência da tag, e **não** "o `package.json` mudou neste push". As duas concordam no caminho normal, mas só a primeira continua certa quando uma run é re-executada, quando vários commits chegam juntos ou quando o histórico é reescrito.

Publica dois artefatos do mesmo build:

- `portmaster-dist-vX.Y.Z.zip` — o `dist` podado para o que roda, mais o `.sha256`;
- `ghcr.io/allan-rcos/portmaster:X.Y.Z` e `:latest`.

O zip leva só `client/` e `txiki/server.mjs`. O `server/` já foi embutido no bundle, e `fbs/` e `paraglide/` chegaram aos assets pelos aliases do Vite — os três eram entrada de build. Detalhes em [`docs/guides/devops.md`](docs/guides/devops.md).

-----

## 📚 Documentação

| | |
|---|---|
| [`docs/architecture/mvvm.md`](docs/architecture/mvvm.md) | as quatro camadas, a regra de dependência e o porquê |
| [`docs/guides/add-feature.md`](docs/guides/add-feature.md) | uma feature de ponta a ponta, arquivo por arquivo |
| [`docs/guides/add-page.md`](docs/guides/add-page.md) | adicionar uma rota do Vike |
| [`docs/guides/add-model-source.md`](docs/guides/add-model-source.md) | adicionar uma fonte de dados |
| [`docs/guides/i18n.md`](docs/guides/i18n.md) · [`styling.md`](docs/guides/styling.md) · [`testing.md`](docs/guides/testing.md) · [`devops.md`](docs/guides/devops.md) | i18n, estilos, testes e infraestrutura |

Cada camada também tem README junto do código: [model](src/model/README.md) · [viewmodel](src/viewmodel/README.md) · [view](src/view/README.md) · [vike-lit](packages/vike-lit/README.md).

-----

## ✏️ Contribuir

Contribuições são bem-vindas. Antes de abrir um PR:

1. `dagger call lint`, `dagger call typecheck`, `dagger call check-translations`, `dagger call test` e `dagger call build` precisam passar.
2. Respeite a direção das dependências. Se o lint reclamar de import, a resposta quase nunca é a exceção — é que a lógica está na camada errada.
3. Regra nova vive no ViewModel, não na View nem na página.
4. Texto novo entra nos três locales; o `i18n:check` reprova o que faltar.
5. Mudou schema `.fbs`? Regere os codecs e comite o resultado.

O guia [`docs/guides/add-feature.md`](docs/guides/add-feature.md) percorre a implementação completa de uma feature.

-----

## 🔓 Licença

[![Apache-2.0](https://img.shields.io/badge/Apache--2.0-green?style=for-the-badge)](LICENSE)
