# Arquitetura MVVM

O PortMaster é organizado em três camadas, com uma regra de dependência que só
aponta para baixo:

```
pages/  →  src/view/  →  src/viewmodel/  →  src/model/
(Vike)     (interface)   (lógica)           (dados)
```

Cada camada só enxerga a de baixo. A regra **não é convenção** — está aplicada
no `eslint.config.mjs` e falha o build quando violada.

## O que mora em cada camada

### Model — `src/model/`

A camada de dados. Sabe falar com a API e nada mais: não conhece Vike, Lit,
i18n nem DOM.

```
src/model/
  contract/swagger/   submodule com o OpenAPI e os schemas FlatBuffers
  core/               cliente HTTP, negociação de wire, erros
  common/             vocabulário transversal (status, risco, permissões)
  <recurso>/
    api.ts            funções que fazem a chamada
    dto.ts            tipos e enums do recurso
    fbs.ts            codecs FlatBuffers
    index.ts          barril do recurso
```

Os bindings do `flatc` não moram em `src/`: saem em `dist/fbs`, gitignorado e
regerado por `bun run gen`, e são importados por `@/fbs/*`.

A separação **`api.ts` × `dto.ts`** não é cosmética: `dto` contém só tipos e
constantes, `api` só funções que exigem um cliente. É o que permite o ViewModel
consumir o vocabulário de dados e repassar à View apenas o que já formatou, sem
que nenhuma chamada de rede fique alcançável de lá.

Precisa de outra fonte de dados — API externa, banco local no navegador,
qualquer infraestrutura? Ela entra aqui, com a mesma forma. Ver
[adicionar uma fonte de dados](../guides/add-model-source.md).

### ViewModel — `src/viewmodel/`

A lógica da aplicação. TypeScript puro: **zero Vike, zero Lit, zero DOM** —
verificado pelo lint.

```
src/viewmodel/
  core/
    client/       browserClient, serverClient e api-client
    session/      sessão e cálculo de permissões
    i18n/         locale, catálogos transversais, contratos de texto, labels
    page/         PageRequest, authorize, erros de domínio, shell, options
    schemas/      peças de validação reusadas
    utils/        cookies e formatação
  <feature>/
    queries/              leitura   — *.query.ts
    mutations/            escrita   — *.mutation.ts
    schemas/              validação Zod
    i18n/                 catálogos de mensagem e contratos de texto
    testing/              factories
    vm-contracts.ts       a superfície que cada PEÇA da tela consome
    <rota>.vm.ts          os DOIS papéis da rota: `createXPageInput` (data,
                          roda no servidor) + `createXVM` (reatividade)
```

### View — `src/view/`

A interface. Recebe dados prontos e não fala com a rede. TypeScript com **Lit**:
`html``` é _tagged template_, então não há compilador de interface no caminho e
**não existe `.tsx` no projeto**.

```
src/view/
  core/
    components/  design system — funções `(props) => TemplateResult`
    layouts/     AppShell
    island/      Island (classe base) + island() (a diretiva que monta)
    islands/     interativos transversais
    styles/      global.scss
    testing/     stub-location (stub de domínio, não harness)
    types.ts     Renderable
  <feature>/
    components/  SSR puros, recebem props
    islands/     *.island.ts — interativos
    screens/     ligam o ViewModel aos componentes
    styles/      SCSS de página
```

### pages — composition root

Só arquivos `+` do Vike. **Sem CSS, sem markup, sem lógica.** Cada arquivo
compõe View e ViewModel, ou adapta o Vike ao contrato neutro do ViewModel.

## As decisões que sustentam isso

### Todo contrato mora no ViewModel — texto e superfície

Quem **produz** é o ViewModel; quem **consome** é a View. Vale para as duas
coisas que atravessam a fronteira:

- as interfaces `*Text`, em `@viewmodel/<feature>/i18n/text-contracts`;
- as interfaces `*VM`, em `@viewmodel/<feature>/vm-contracts`.

Se morassem no componente, o ViewModel dependeria da View para se tipar,
invertendo a regra.

O `tsc` fecha o ciclo nas duas pontas: catálogo que esquece uma chave falha no
build, não na tela — e VM que esquece um método falha na **declaração**, porque
a superfície é declarada com `extends` e não só satisfeita por acaso.

Um contrato por PEÇA da tela, não por rota. É o que deixa `/produtos/nova` e
`/produtos/@id/editar` satisfazerem o mesmo `ProductFormVM` (e o formulário ser
um componente só), e o que faz o tipo do detalhe de contêiner dizer, sozinho,
que a tela é `ContainerActionsVM + ManifestEditorVM + o resto`.

### A View nunca importa `@model`

Ela recebe o vocabulário de dados pelos tipos que o ViewModel expõe — as
`XRowData`/`XFacts` que o `createXPageInput` já formatou. Nenhuma função de API
alcança a camada, por construção do lint.

### O ViewModel não conhece o roteador

Carregadores de página recebem `PageRequest` — `{ headers, url, routeParams }` —
e não o `PageContext` do Vike. Duas consequências: o ViewModel é testável com um
objeto literal, e trocar o roteador toca só o adaptador em `pages/`.

Do mesmo modo, "recurso não existe" é sinalizado com `PageNotFoundError`, não
com `render(404)`: traduzir domínio em status HTTP é papel do composition root.

### Todo dado é resolvido antes do render

O `+data` de cada rota roda nos DOIS lados e chama o `createXPageInput`. No
servidor isso acontece **antes** do render, então o HTML da primeira requisição
sai completo para qualquer User-Agent — sem esqueleto e sem depender de JS. No
cliente a mesma função vai no bundle, então a navegação client-side resolve no
navegador e não gera requisição de página.

A consequência de desenho: quando uma tela renderiza, o dado já existe. Não há
`AsyncBoundary`, não há `load()` no mount, e nenhum componente trata "carregando".

### Uma única reatividade: alien-signals

`signal`/`computed`/`effect`, usados crus. O `onRenderClient` do `vike-lit`
liga **um** effect raiz que reavalia o template da página; ler um getter do
ViewModel ali é o que registra a dependência, e o diff do `lit-html` decide o DOM.

Não há ponte a manter. Os `observable/` genéricos e os arquivos `to-accessor.ts`
e `bind-mutation.ts` existiam só para traduzir alien-signals no sistema do Solid
— saíram junto com ele.

Estado de formulário também é alien-signals, no **ViewModel da rota**, escrito à
mão. Ver [`src/viewmodel/README.md`](../../src/viewmodel/README.md).

### A integração de interface é nossa: `vike-lit`

~1.000 linhas espelhando arquivo a arquivo o fonte do `vike-solid` oficial —
inclusive o caminho de bot (`isbot-fast`) e todo o bloco de `<head>`. O que muda
é o miolo de render: `hydrate()` + effect raiz no cliente, `collectResult` no
servidor.

Mora em [repositório próprio](https://github.com/allan-rcos/vike-lit) e entra
aqui como submodule, em `packages/vike-lit` — não é código deste projeto, e o
lint daqui o ignora. A documentação dele é autônoma: o mapeamento contra o
upstream fica em `docs/upstream.md` lá, para que acompanhar mudança de contrato
do Vike seja um diff, não arqueologia.

Restrição de runtime que o ESLint daqui também aplica: do `@lit-labs/ssr` são
proibidos os caminhos que alcançam `lib/dom-shim.js` (→ `node-fetch`) ou outros
built-ins do Node, ausentes no txiki — `install-global-dom-shim.js`,
`render-with-global-dom-shim.js`, `module-loader.js` e
`render-result-readable.js`. A raiz é permitida, e é de onde `render` vem.

## Aliases

| alias           | destino                                       |
| --------------- | --------------------------------------------- |
| `@model/*`      | `src/model/*`                                 |
| `@viewmodel/*`  | `src/viewmodel/*`                             |
| `@view/*`       | `src/view/*`                                  |
| `@/paraglide/*` | `dist/paraglide/*` (saída do compilador i18n) |
| `@ds`           | `packages/tachyon-design/scss`                |

Declarados em `tsconfig.json`, `vite.config.ts` e `vitest.config.ts` — os três
precisam ficar em sincronia.

## Próximos passos

- [Criar uma feature do zero](../guides/add-feature.md)
- [Adicionar uma página](../guides/add-page.md)
- [Adicionar uma fonte de dados ao Model](../guides/add-model-source.md)
- [Como testar cada camada](../guides/testing.md)
