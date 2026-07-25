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

A camada de dados. Sabe falar com a API e nada mais: não conhece Vike, Solid,
i18n nem DOM.

```
src/model/
  contract/swagger/   submodule com o OpenAPI e os schemas FlatBuffers
  core/               cliente HTTP, negociação de wire, erros
  common/             vocabulário transversal (status, risco, permissões)
  generated/fbs/      saída do flatc (commitada; regenerável com bun run gen:fbs)
  <recurso>/
    api.ts            funções que fazem a chamada
    dto.ts            tipos e enums do recurso
    fbs.ts            codecs FlatBuffers
    index.ts          barril do recurso
```

A separação **`api.ts` × `dto.ts`** não é cosmética: `dto` contém só tipos e
constantes, `api` só funções que exigem um cliente. É o que permite a View
receber o vocabulário de dados sem alcançar nenhuma chamada de rede (ver
`domain.ts` no ViewModel).

Precisa de outra fonte de dados — API externa, banco local no navegador,
qualquer infraestrutura? Ela entra aqui, com a mesma forma. Ver
[adicionar uma fonte de dados](../guides/add-model-source.md).

### ViewModel — `src/viewmodel/`

A lógica da aplicação. TypeScript puro: **zero JSX, zero Vike, zero Solid** —
verificado pelo lint.

```
src/viewmodel/
  core/
    client/       browserClient, serverClient e resolveClient
    session/      sessão e cálculo de permissões
    i18n/         locale, catálogos transversais e contratos de texto
    observable/   async-signal e mutation-signal (alien-signals)
    page/         PageRequest, VMContext e erros de domínio
    utils/        cookies e formatação
  <feature>/
    domain.ts             reexporta o `dto` do Model para a View
    queries/              leitura   — *.query.ts
    mutations/            escrita   — *.mutation.ts
    schemas/              validação Zod
    i18n/                 catálogos de mensagem e contratos de texto
    <rota>.vm.ts          ViewModel de tela (observável) + meta da rota
```

### View — `src/view/`

A interface. Recebe dados prontos e não fala com a rede.

```
src/view/
  core/
    components/  design system
    layouts/     AppShell
    islands/     interativos transversais
    forms/       adaptador Zod → TanStack Form
    observable/  ponte alien-signals → Solid
    screens/     cola comum das telas assíncronas
    styles/      global.scss
  <feature>/
    components/  SSR puros, recebem props
    islands/     *.island.tsx — interativos
    screens/     ligam o ViewModel aos componentes
    styles/      SCSS de página
```

### pages — composition root

Só arquivos `+` do Vike. **Sem CSS, sem markup, sem lógica.** Cada arquivo
compõe View e ViewModel, ou adapta o Vike ao contrato neutro do ViewModel.

## As decisões que sustentam isso

### O contrato de texto mora no ViewModel

Quem **produz** o texto (resolvendo um catálogo para um locale) é o ViewModel;
quem **consome** é a View. Por isso as interfaces `*Text` vivem em
`@viewmodel/<feature>/i18n/text-contracts` — se morassem no componente, o
ViewModel dependeria da View para se tipar, invertendo a regra.

O `tsc` fecha o ciclo: catálogo que esquece uma chave falha no build, não na tela.

### A View nunca importa `@model`

Ela recebe o vocabulário de dados por `@viewmodel/<feature>/domain`, que
reexporta **apenas** o submódulo `dto`. Como `dto` não tem funções, é
estruturalmente impossível uma chamada de rede vazar para a interface.

### O ViewModel não conhece o roteador

Carregadores de página recebem `PageRequest` — `{ headers, url, routeParams }` —
e não o `PageContext` do Vike. Duas consequências: o ViewModel é testável com um
objeto literal, e trocar o roteador toca só o adaptador em `pages/`.

Do mesmo modo, "recurso não existe" é sinalizado com `PageNotFoundError`, não
com `render(404)`: traduzir domínio em status HTTP é papel do composition root.

### Servidor ou cliente é uma decisão de uma linha

`VMContext` decide o lado pela **presença de `headers`**:

```ts
createProductListVM({ url }); // navegador
createProductListVM({ url, headers }); // SSR
```

`resolveClient(headers)` escolhe o cliente HTTP e `contextLocale` escolhe a
origem do locale. Hoje as telas de `/painel` rodam no navegador — o servidor só
executa o guard. Levar uma de volta ao SSR é chamar o mesmo ViewModel dentro de
um `+data.ts`, passando os headers. Nenhum ViewModel muda.

As rotas públicas (`/entrar`, `/info`, `/_error`) seguem em SSR com dados, que é
onde o SEO importa.

### O ViewModel trabalha sobre observables

`createAsyncSignal` e `createMutationSignal` usam **alien-signals**, e não os
primitivos do Solid — é o que mantém a camada independente do framework de
interface. A ponte (`toAccessor`, `bindMutation`) é o único ponto do projeto que
conhece as duas bibliotecas.

## Aliases

| alias           | destino                                       |
| --------------- | --------------------------------------------- |
| `@model/*`      | `src/model/*`                                 |
| `@viewmodel/*`  | `src/viewmodel/*`                             |
| `@view/*`       | `src/view/*`                                  |
| `@testing/*`    | `src/testing/*`                               |
| `@/paraglide/*` | `dist/paraglide/*` (saída do compilador i18n) |
| `@ds`           | `packages/tachyon-design/scss`                |

Declarados em `tsconfig.json`, `vite.config.ts` e `vitest.config.ts` — os três
precisam ficar em sincronia.

## Próximos passos

- [Criar uma feature do zero](../guides/add-feature.md)
- [Adicionar uma página](../guides/add-page.md)
- [Adicionar uma fonte de dados ao Model](../guides/add-model-source.md)
- [Como testar cada camada](../../src/testing/README.md)
