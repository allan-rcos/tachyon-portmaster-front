# Criar uma feature do zero

Receita ponta a ponta, de baixo para cima — a mesma ordem da regra de
dependência. O exemplo é uma feature fictícia de **berços de atracação**
(`berths`), com listagem e cadastro.

Se você só precisa de uma tela nova sobre dados que já existem, veja
[adicionar uma página](add-page.md).

---

## 1. Model — o recurso

`src/model/berths/`, com a mesma forma dos demais recursos.

**`dto.ts`** — só tipos e constantes. Nunca funções: é o que permite reexportar
este arquivo para a View sem expor chamadas de rede.

```ts
import type { Paged } from '../common/dto';

export const BERTH_STATUS = ['Free', 'Occupied', 'Maintenance'] as const;
/** Situação operacional de um berço. */
export type BerthStatus = (typeof BERTH_STATUS)[number];

/** Berço de atracação, com o navio ocupante quando houver. */
export interface Berth {
  id: string;
  code: string;
  status: BerthStatus;
  vessel_name?: string;
}

/** Corpo do cadastro de berço. */
export interface BerthCreateRequest {
  code: string;
}

/** Página de berços. */
export type BerthList = Paged<Berth>;
```

**`api.ts`** — as chamadas. Recebem o cliente por parâmetro; o Model nunca o
constrói.

```ts
import { wire } from '../core/wire';
import type { ApiClient } from '../core/http';
import type { Berth, BerthCreateRequest, BerthList } from './dto';

/**
 * Lista os berços.
 *
 * @param c     Cliente HTTP configurado.
 * @param query Filtros e paginação.
 */
export const listBerths = (c: ApiClient, query?: Record<string, string>): Promise<BerthList> =>
  wire(c, { method: 'GET', path: '/v1/berths', query });

/**
 * Cadastra um berço.
 *
 * @param c    Cliente HTTP configurado.
 * @param body Dados do berço.
 */
export const createBerth = (c: ApiClient, body: BerthCreateRequest): Promise<Berth> =>
  wire(c, { method: 'POST', path: '/v1/berths', body });
```

**`index.ts`** — `export * from './api'; export * from './dto';`

**`fbs.ts`** só é necessário quando a rota tiver codec FlatBuffers; sem ele, a
chamada usa JSON nos dois ambientes.

> O JSDoc é **obrigatório** em Model e ViewModel — o lint reprova sem ele.

---

## 2. ViewModel — a lógica

### `domain.ts` — o que a View pode ver

```ts
export * from '@model/berths/dto';
```

Uma linha, e ela é a fronteira: como `dto` não tem funções, nenhuma chamada de
rede alcança a interface.

### `queries/list-berths.query.ts`

```ts
import { listBerths as apiListBerths } from '@model/berths';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

/**
 * Lista os berços de atracação.
 *
 * @param headers Cabeçalhos do request no SSR; omitir no navegador.
 * @param query   Query string da rota (cursor e busca).
 */
export function listBerths(headers?: IncomingHeaders, query?: URLSearchParams) {
  const params: Record<string, string> = { limit: query?.get('limit') ?? '50' };
  const cursor = query?.get('cursor');
  if (cursor) params.cursor = cursor;
  return apiListBerths(resolveClient(headers), params);
}
```

`headers` **opcional** e `resolveClient` não são detalhe: é o que faz a query
servir tanto o SSR quanto o navegador.

### `mutations/create-berth.mutation.ts`

Mutations amarram o `browserClient` por dentro — a View nunca vê um cliente.

```ts
import { createBerth as apiCreateBerth } from '@model/berths';

import { browserClient } from '../../core/client/api-client';
import type { Berth } from '../domain';
import type { BerthFormData } from '../schemas/berth.schema';

/**
 * Cadastra um berço.
 *
 * @param input Dados já validados pelo schema.
 */
export function createBerth(input: BerthFormData): Promise<Berth> {
  return apiCreateBerth(browserClient, input);
}
```

### `schemas/berth.schema.ts`

O texto de erro entra por parâmetro — é o que permite a mesma regra falar o
idioma da requisição.

```ts
import { z } from 'zod';

/** Chaves de erro que este schema consome. */
export interface BerthSchemaText {
  codeRequired: string;
}

/**
 * Schema do cadastro de berço.
 *
 * @param t Mensagens de erro já resolvidas; omitir cai no pt-BR.
 */
export function createBerthSchema(t?: BerthSchemaText) {
  return z.object({
    code: z
      .string()
      .trim()
      .min(1, t?.codeRequired ?? 'Informe o código'),
  });
}

export const berthSchema = createBerthSchema();
export type BerthFormData = z.infer<typeof berthSchema>;
```

### `i18n/text-contracts.ts` e `i18n/berth-list-page.messages.ts`

O contrato mora aqui, e não no componente — ver
[a arquitetura](../architecture/mvvm.md#o-contrato-de-texto-mora-no-viewmodel).

```ts
// text-contracts.ts
/** Chaves de texto que a listagem de berços consome. */
export interface BerthListText {
  title: string;
  subtitle: string;
  code: string;
  status: string;
  empty: string;
}
```

```ts
// berth-list-page.messages.ts
import { commonText } from '@viewmodel/core/i18n/common';
import type { Locale } from '@viewmodel/core/i18n/locale';

import type { BerthListText } from './text-contracts';

import { m } from '@/paraglide/messages';

export const berthListMessages = (locale: Locale): BerthListText => ({
  ...commonText(locale),
  title: m.berths_title({}, { locale }),
  subtitle: m.berths_subtitle({}, { locale }),
  code: m.berths_code({}, { locale }),
  status: m.berths_status({}, { locale }),
});
```

Adicione as chaves nos **três** catálogos e declare-as no
`berth-list-page.messages.schema.json` irmão — ver
[o guia de i18n](i18n.md). `bun run i18n:check` reprova chave faltante em
qualquer locale, e também chave declarada e não usada.

### `berth-list-page.vm.ts` — o ViewModel da tela

```ts
import type { BerthList } from './domain';
import { berthListMessages } from './i18n/berth-list-page.messages';
import type { BerthListText } from './i18n/text-contracts';
import { listBerths } from './queries/list-berths.query';
import {
  asyncBoundaryMessages,
  type AsyncBoundaryText,
} from '../core/i18n/async-boundary.messages';
import { createAsyncSignal, type AsyncSignal } from '../core/observable/async-signal';
import type { PageMeta } from '../core/page/page-request';
import { contextLocale, contextParams, type VMContext } from '../core/page/vm-context';

/** Superfície observável da listagem de berços. */
export interface BerthListVM {
  t: BerthListText;
  boundary: AsyncBoundaryText;
  berths: AsyncSignal<BerthList, []>;
  load: () => Promise<void>;
}

/**
 * Cria o ViewModel da listagem de berços.
 *
 * @param context Contexto de execução — navegador quando omitido.
 */
export function createBerthListVM(context: VMContext = {}): BerthListVM {
  const t = berthListMessages(contextLocale(context));
  const boundary = asyncBoundaryMessages(contextLocale(context));
  const params = contextParams(context);
  const berths = createAsyncSignal<BerthList, []>(() => listBerths(context.headers, params));

  return { t, boundary, berths, load: () => berths.run() };
}

/**
 * Título e descrição da rota, para o `<head>`.
 *
 * @param context Contexto de execução — só o locale importa aqui.
 */
export function berthListMeta(context: VMContext = {}): PageMeta {
  const t = berthListMessages(contextLocale(context));
  return { title: t.title, description: t.subtitle };
}
```

---

## 3. View — a interface

### `components/BerthList.tsx` — puro

Recebe dados prontos e o texto. Não busca nada, não guarda estado.

```tsx
import { DataTable, type Column } from '@view/core/components/DataTable';
import { PageHeader } from '@view/core/components/PageHeader';
import type { Berth } from '@viewmodel/berths/domain';
import type { BerthListText } from '@viewmodel/berths/i18n/text-contracts';
import type { JSX } from 'solid-js';

export function BerthList(props: { items: Berth[]; total: number; t: BerthListText }): JSX.Element {
  const columns = (): Column<Berth>[] => [
    { header: props.t.code, cell: (b) => b.code },
    { header: props.t.status, cell: (b) => b.status },
  ];
  return (
    <section>
      <PageHeader title={props.t.title} subtitle={props.t.subtitle} />
      <DataTable items={props.items} columns={columns()} empty={props.t.empty} />
    </section>
  );
}
```

### `screens/BerthListScreen.tsx` — a cola

Liga os sinais do ViewModel ao componente puro. `createScreenBinding` faz o
ritual (assinar + carregar na montagem) e `AsyncBoundary` trata
carregando/erro/retry.

```tsx
import { AsyncBoundary } from '@view/core/components/AsyncBoundary';
import { Skeleton } from '@view/core/components/Skeleton';
import { createScreenBinding } from '@view/core/screens/createScreenBinding';
import { BerthList } from '@view/berths/components/BerthList';
import type { BerthListVM } from '@viewmodel/berths/berth-list-page.vm';
import type { JSX } from 'solid-js';

export function BerthListScreen(props: { vm: BerthListVM }): JSX.Element {
  const { data, status } = createScreenBinding(props.vm.berths, props.vm.load);

  return (
    <AsyncBoundary
      status={status()}
      data={data()}
      fallback={<Skeleton height="18rem" />}
      errorMessage={props.vm.boundary.loadError}
      retryLabel={props.vm.boundary.retry}
      onRetry={() => void props.vm.load()}
    >
      {(page) => <BerthList items={page.data} total={page.total} t={props.vm.t} />}
    </AsyncBoundary>
  );
}
```

### `islands/BerthForm.island.tsx` — o interativo

Chama a **mutation do ViewModel**, nunca o Model. `bindMutation` traz o estado
para a reatividade do Solid; `zodValidator` pluga o schema no formulário.

```tsx
const mutation = bindMutation(
  createMutationSignal((value: BerthFormData) => createBerth(value), {
    onSuccess: () => {
      window.location.href = '/painel/bercos';
    },
  }),
);

const form = createForm(() => ({
  defaultValues: { code: '' } as BerthFormData,
  validators: { onChange: zodValidator<BerthFormData>(createBerthSchema(props.t)) },
  onSubmit: ({ value }) => mutation.mutate(value),
}));
```

---

## 4. pages — a rota

Só composição. Sem CSS, sem markup.

```
pages/painel/bercos/
  +Page.tsx          instancia o VM e renderiza a tela
  +routeMeta.ts      reexporta o meta do VM
  +permissions.js    permissões exigidas
```

```tsx
// +Page.tsx
import { BerthListScreen } from '@view/berths/screens/BerthListScreen';
import { createBerthListVM } from '@viewmodel/berths/berth-list-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createBerthListVM({ url: pageContext.urlOriginal });
  return (
    <ClientOnly fallback={<div />}>
      <BerthListScreen vm={vm} />
    </ClientOnly>
  );
}
```

```ts
// +routeMeta.ts
export { berthListMeta as default } from '@viewmodel/berths/berth-list-page.vm';
```

```js
// +permissions.js
export default ['BerthRead'];
```

Acrescente o item de navegação em `src/view/core/components/Sidebar.tsx` e a
chave correspondente em `navText`.

---

## 5. Testes

Um por camada, cada um mockando a fronteira logo abaixo. Ver
[a infra de teste](../../src/testing/README.md) para os detalhes.

```
src/model/berths/                     (opcional: codecs)
src/viewmodel/berths/queries/list-berths.query.test.ts    mocka @model/berths
src/viewmodel/berths/berth-list-page.vm.test.ts           mocka a query
src/view/berths/islands/BerthForm.island.test.tsx         mocka a mutation
src/view/berths/components/BerthList.test.tsx             não mocka nada
```

Adicione a factory do DTO em `src/testing/factories/model.factory.ts`.

---

## Antes de abrir o PR

```bash
bun run i18n:check   # contrato de tradução nos 3 locales
bun run lint         # camadas, JSDoc e ordem de import
bun run typecheck
bun run test
bun run build
```

## Checklist do que costuma escapar

- [ ] `dto.ts` sem nenhuma função — senão a View alcança a rede pelo `domain.ts`
- [ ] `headers` **opcional** nas queries, e `resolveClient` em vez de `serverClient`
- [ ] O contrato `*Text` em `i18n/text-contracts`, não no componente
- [ ] Chaves i18n nos **três** catálogos e declaradas no schema
- [ ] JSDoc em tudo que Model e ViewModel exportam
- [ ] `pages/` sem CSS e sem markup
