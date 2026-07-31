# ViewModel — a lógica da aplicação

Tudo que é lógica e não é interface. TypeScript puro: **zero Vike, zero Lit,
zero DOM** — verificado pelo lint.

```
viewmodel/
  core/
    client/       browserClient, serverClient e api-client
    session/      sessão e cálculo de permissões
    i18n/         locale, catálogos transversais, contratos de texto, labels
    page/         PageRequest, authorize, PageNotFoundError, shell, options
    schemas/      peças de validação reusadas (numeric-string)
    utils/        cookies e formatação
    error-page.vm.ts
  <feature>/
    queries/              leitura   — list-x.query.ts, get-x.query.ts
    mutations/            escrita   — create-x.mutation.ts, delete-x.mutation.ts
    schemas/              validação Zod
    i18n/                 catálogos e contratos de texto
    testing/              factories
    <rota>.vm.ts          os dois papéis da rota (abaixo)
```

## Os dois papéis de cada rota

Cada `<rota>.vm.ts` exporta duas coisas, e a separação é o eixo do desenho:

```ts
// 1. DATA — trabalho de servidor. Autoriza, resolve i18n, busca, FORMATA.
//    Devolve dado puro e serializável, que atravessa o `passToClient` do Vike.
export async function createProductListPageInput(request: PageRequest): Promise<…>

// 2. REATIVIDADE — recebe o que o data resolveu e devolve sinais + ações.
export function createProductListVM(input: ProductListPageInput): ProductListVM
```

Quando a tela renderiza, **o dado já existe**. Não há carga inicial, não há
esqueleto, e o HTML da primeira requisição sai completo para qualquer
User-Agent.

## Formatar é trabalho daqui

Pesos, datas, percentuais, rótulos de status e contagens saem deste lado **já
como string**, no locale da requisição. A View não usa `Intl` e não faz
aritmética — ela desenha.

## Autorização mora na rota

`authorize(request, PERMISSIONS)` é chamado pelo `createXPageInput`, que declara
as permissões que exige. Antes isso era um `+permissions.js` avaliado por um
guard genérico, longe do código da tela.

O ViewModel lança **erro de domínio** (`UnauthorizedError`, `ForbiddenError`,
`PageNotFoundError`); traduzir para `redirect`/`render(403)`/`render(404)` é
papel da casca em `pages/pageInput.ts`. É o que permite testar autorização sem
levantar Vike nenhum.

## Queries × mutations

|              | recebe cliente                    | uso                               |
| ------------ | --------------------------------- | --------------------------------- |
| **query**    | `headers?` → escolhe o cliente    | leitura; roda nos dois lados      |
| **mutation** | amarra `browserClient` por dentro | escrita; disparada pela interface |

Mutations não expõem cliente porque só acontecem no navegador, a partir de uma
ação do usuário. Uma delas (`update-user`) compõe duas chamadas que a API separa
— compor é trabalho daqui, não da tela.

## Estado de formulário mora AQUI

Valores, campos tocados, "está enviando" e "falhou" são estado de aplicação. O
formulário fica no VM da rota, escrito à mão, com as peças que já existem —
`signal`/`computed` do alien-signals e o schema Zod da feature:

```ts
const values = signal({ name: '', density: '' });
const touched = signal<ReadonlySet<Field>>(new Set());
const submitting = signal(false);
const failed = signal(false);

const problems = computed(() => {
  const r = schema.safeParse(values());
  return r.success ? {} : z.flattenError(r.error).fieldErrors;
});
```

**Não há helper compartilhado entre os nove formulários**, e é deliberado: o
preço é ~35 linhas parecidas por rota, e o preço da alternativa era mais um
`createXSignal` genérico. A repetição é legível; a abstração não era.

Duas convenções que se repetem porque significam coisas diferentes:

- **`submit()` nunca rejeita** — devolve `Promise<boolean>` e o erro vira
  `failed()`. Quem chama é um handler de submit, e um `unhandled rejection` ali
  não tem quem o trate.
- **`remove()`/`seal()`/`dispatch()` REJEITAM** — quem chama é o `ConfirmDialog`,
  que tem estado de erro próprio e espera uma promise crua.

Erro de campo aparece depois do **blur**; erro de conjunto (matriz de permissões,
seleção de perfis) aparece depois da **primeira tentativa de envio** — não existe
"tocar" um grupo de caixas.

## Reatividade: só alien-signals

`signal(v)` lê por chamada e escreve por chamada; `computed` deriva; `effect`
observa. Não há wrapper e não há ponte para o framework de interface — o effect
raiz do `vike-lit` lê os getters ao desenhar, e é isso que registra a
dependência.

Os `observable/` genéricos (`async-signal`, `mutation-signal`, `signal`) foram
apagados. Ponto de atenção registrado: o `createAsyncSignal` tinha guarda de
corrida para busca com filtro digitável. Estava morto quando saiu, então nada se
perdeu — mas a primeira tela com filtro digitável precisará escrever essa guarda
à mão.

## O ViewModel não conhece o roteador

Carregadores de página recebem `PageRequest` (`{ headers, url, routeParams }`),
nunca o `PageContext` do Vike. Testar é passar um objeto literal.

## Contratos de texto

As interfaces `*Text` vivem em `<feature>/i18n/text-contracts.ts`, e não na View:
quem **produz** o texto é esta camada. Se morassem lá, o ViewModel dependeria da
View para se tipar.

## Testes

Os `*.vm.test.ts` são a maior parte da suíte, e nenhum precisa de DOM — nem os
de formulário. `bun run test` exercita validação, submissão e autorização
chamando funções.

## JSDoc é obrigatório

Como no Model. Escreva a descrição à mão — `eslint --fix` insere tags vazias.
