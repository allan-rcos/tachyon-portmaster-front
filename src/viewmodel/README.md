# ViewModel — a lógica da aplicação

Tudo que é lógica e não é componente. TypeScript puro: **zero JSX, zero Vike,
zero Solid** — verificado pelo lint.

```
viewmodel/
  core/
    client/       browserClient, serverClient e resolveClient
    session/      sessão e cálculo de permissões
    i18n/         locale, catálogos transversais, contratos de texto
    observable/   async-signal e mutation-signal (alien-signals)
    page/         PageRequest, VMContext, PageNotFoundError
    utils/        cookies e formatação
  <feature>/
    domain.ts             reexporta o `dto` do Model para a View
    queries/              leitura   — list-x.query.ts, get-x.query.ts
    mutations/            escrita   — create-x.mutation.ts, delete-x.mutation.ts
    schemas/              validação Zod
    i18n/                 catálogos e contratos de texto
    <rota>.vm.ts          ViewModel de tela + meta da rota
```

## Servidor ou cliente: a presença de `headers`

`VMContext` decide o lado por um campo:

```ts
createProductListVM({ url }); // navegador
createProductListVM({ url, headers }); // SSR
```

`resolveClient(headers)` escolhe o cliente HTTP e `contextLocale(context)`
escolhe a origem do locale. Por isso **queries recebem `headers` como
opcional** — é o que as faz servir os dois lados sem duplicação.

## Queries × mutations

|              | recebe cliente                    | uso                               |
| ------------ | --------------------------------- | --------------------------------- |
| **query**    | `headers?` → `resolveClient`      | leitura; roda nos dois lados      |
| **mutation** | amarra `browserClient` por dentro | escrita; disparada pela interface |

Mutations não expõem cliente porque só acontecem no navegador, a partir de uma
ação do usuário. Uma delas (`update-user`) compõe duas chamadas que a API separa
— compor é trabalho daqui, não da tela.

## ViewModel de tela

Uma factory que devolve sinais e ações:

```ts
export function createProductListVM(context: VMContext = {}): ProductListVM {
  const t = productsListMessages(contextLocale(context));
  const boundary = asyncBoundaryMessages(contextLocale(context));
  const products = createAsyncSignal(() => listProducts(context.headers, contextParams(context)));
  return { t, boundary, products, load: () => products.run() };
}
```

Nada é buscado na criação: quem dispara é a tela, no `onMount`. É o que mantém
o servidor sem trabalho de dados nas rotas de `/painel`.

## Observables

`createAsyncSignal` e `createMutationSignal` usam **alien-signals**, não os
primitivos do Solid — é o que mantém a camada independente da interface. Duas
garantias que valem conhecer:

- o async-signal **descarta resposta obsoleta**: filtro digitado rápido não
  termina mostrando o resultado antigo;
- `mutate` **nunca rejeita** — o erro vira estado, o que elimina a classe de
  unhandled rejection em handler de submit.

## O ViewModel não conhece o roteador

Carregadores de página recebem `PageRequest` (`{ headers, url, routeParams }`),
nunca o `PageContext` do Vike. Testar é passar um objeto literal.

"Recurso não existe" é `PageNotFoundError` — traduzir para 404 é papel da casca
em `pages/`.

## Contratos de texto

As interfaces `*Text` vivem em `<feature>/i18n/text-contracts.ts`, e não no
componente: quem **produz** o texto é esta camada. Se morassem na View, o
ViewModel dependeria dela para se tipar.

## JSDoc é obrigatório

Como no Model. Escreva a descrição à mão — `eslint --fix` insere tags vazias.
