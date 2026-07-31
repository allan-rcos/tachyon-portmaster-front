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

### `berth-list-page.vm.ts` — os dois papéis da rota

Um arquivo, duas metades: o **data** (trabalho de servidor, resolvido antes do
render) e a **reatividade** (o que a tela assina).

```ts
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import type { Tone } from '@viewmodel/core/i18n/labels';
import { authorize } from '@viewmodel/core/page/authorize';
import type { PageMeta, PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import { signal } from 'alien-signals';

import { berthListMessages } from './i18n/berth-list-page.messages';
import type { BerthListText } from './i18n/text-contracts';
import { listBerths } from './queries/list-berths.query';

/** Permissões que a rota exige. */
export const BERTH_LIST_PERMISSIONS = ['berth:read'] as const;

/** Uma linha da listagem, JÁ FORMATADA. A View não formata nada. */
export interface BerthRowData {
  id: string;
  code: string;
  status: { label: string; tone: Tone };
  draft: string;
  detailHref: string;
}

/** Tudo que a tela precisa. Serializável — atravessa o `passToClient`. */
export interface BerthListPageInput {
  meta: PageMeta;
  shell: ShellIdentity;
  t: BerthListText;
  items: readonly BerthRowData[];
  nextCursor?: string;
}

/**
 * O trabalho de servidor: autoriza, resolve i18n, busca e formata.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem a permissão `berth:read`.
 */
export async function createBerthListPageInput(
  request: PageRequest,
): Promise<BerthListPageInput> {
  const account = await authorize(request, BERTH_LIST_PERMISSIONS);
  const locale = resolveLocale(request.headers);
  const t = berthListMessages(locale);
  const page = await listBerths(request.headers);

  return {
    meta: { title: t.title, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    items: page.data.map((b) => toRow(b, locale)),
    nextCursor: page.next_cursor,
  };
}

/** Superfície reativa da listagem. */
export interface BerthListVM {
  t: BerthListText;
  items: () => readonly BerthRowData[];
  hasMore: () => boolean;
  loadMore: () => Promise<void>;
}

/**
 * Cria o ViewModel da listagem a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createBerthListVM(input: BerthListPageInput): BerthListVM {
  const items = signal<readonly BerthRowData[]>(input.items);
  const cursor = signal(input.nextCursor);
  /* … `loadMore` com try/catch/finally, como em product-list-page.vm … */
}
```

Permissão é **slug** (`'berth:read'`), servido em runtime por
`GET /metadata/permissions` — não há enum a importar.

Formulário nesta feature? O estado dele mora **aqui**, escrito à mão com
`signal`/`computed` e o schema Zod. Ver
[`src/viewmodel/README.md`](../../src/viewmodel/README.md) e
`product-create-page.vm.ts` como referência.

---

## 3. View — a interface

### `components/BerthList.ts` — puro

Recebe o ViewModel e desenha. Não busca nada, não guarda estado, não formata.

```ts
import { RowList } from '@view/core/components/RowList';
import type { BerthListVM, BerthRowData } from '@viewmodel/berths/berth-list-page.vm';
import { html, type TemplateResult } from 'lit';

export function BerthList(props: { vm: BerthListVM }): TemplateResult {
  const { vm } = props;
  const items = vm.items();

  return html`<section>
    ${RowList<BerthRowData>({
      columns: '1fr 160px 120px',
      headers: [vm.t.code, vm.t.status, vm.t.draft],
      items,
      children: (item) => BerthRow({ item }),
    })}
  </section>`;
}
```

Getters do ViewModel são lidos **direto** (`vm.items()`): o effect raiz reavalia
este template, e é isso que registra a dependência.

### `screens/BerthListScreen.ts` — a cola

Uma linha, porque não há mais ritual de carregamento a fazer: quando a tela
renderiza, o dado já existe.

```ts
export function BerthListScreen(props: { vm: BerthListVM }): TemplateResult {
  return BerthList({ vm: props.vm });
}
```

### `islands/BerthForm.island.ts` — o interativo

Desenho puro sobre o VM da rota. Declara o que precisa (`value`, `error`,
`submit`), e quem navega é ele:

```ts
export interface BerthFormVM {
  value: (field: BerthField) => string;
  error: (field: BerthField) => string | undefined;
  submitting: () => boolean;
  submit: () => Promise<boolean>;
  listHref: string;
  t: BerthFormText;
}

const submit = (event: Event) => {
  event.preventDefault();
  void vm.submit().then((ok) => {
    if (ok) window.location.href = vm.listHref;
  });
};
```

Island vira **classe** só quando precisa guardar estado de interface própria — um
diálogo aberto, um observador de viewport. Ver
[`src/view/README.md`](../../src/view/README.md).

---

## 4. pages — a rota

Só composição. Sem CSS, sem markup, sem lógica.

```
pages/painel/bercos/
  +data.ts   delega ao `createBerthListPageInput`
  +Page.ts   constrói o VM e devolve o thunk
```

Não há `+permissions.js` (a permissão é declarada pelo `*.vm.ts` da rota) nem
`+routeMeta.ts` (o `<head>` sai de `data.meta`).

```ts
// +data.ts
import { createBerthListPageInput } from '@viewmodel/berths/berth-list-page.vm';
import type { PageContext } from 'vike/types';

import { toPageInput } from '@/pages/pageInput';

export { data };

/**
 * Trabalho de servidor da rota, resolvido ANTES do render.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
async function data(pageContext: PageContext) {
  return toPageInput(pageContext, createBerthListPageInput);
}
```

```ts
// +Page.ts
import { BerthListScreen } from '@view/berths/screens/BerthListScreen';
import {
  createBerthListVM,
  type BerthListPageInput,
} from '@viewmodel/berths/berth-list-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createBerthListVM(pageContext.data as BerthListPageInput);
  return () => BerthListScreen({ vm });
}
```

A fábrica roda **uma vez**; o thunk devolvido é o que o laço de render reavalia.
É isso que faz o estado do VM sobreviver aos re-renders.

Acrescente o item de navegação em `src/view/core/components/Sidebar.ts` e a
chave correspondente em `navText`.

---

## 5. Testes

Um por camada, cada um mockando a fronteira logo abaixo. Ver
[o guia de testes](testing.md) para os detalhes.

```
src/model/berths/                     (opcional: codecs)
src/viewmodel/berths/queries/list-berths.query.test.ts    mocka @model/berths
src/viewmodel/berths/berth-list-page.vm.test.ts           mocka a query e as
                                                          mutations — inclusive o
                                                          formulário, sem DOM
src/view/berths/components/BerthList.test.ts              não mocka nada
```

A factory do DTO vai em `src/viewmodel/berths/testing/berth.factory.ts`, junto da
feature.

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

- [ ] `dto.ts` sem nenhuma função — é o que mantém a rede fora do alcance da View
- [ ] `headers` **opcional** nas queries, para servirem os dois lados
- [ ] Nada formatado na View: peso, data e percentual saem do ViewModel como string
- [ ] `submit()` devolvendo `Promise<boolean>` e nunca rejeitando; `remove()` rejeitando
- [ ] O contrato `*Text` em `i18n/text-contracts`, não no componente
- [ ] Chaves i18n nos **três** catálogos e declaradas no schema
- [ ] JSDoc em tudo que Model e ViewModel exportam
- [ ] `pages/` sem CSS e sem markup
- [ ] Nenhum `.tsx`: a View é TypeScript com `html``` do Lit
- [ ] `<span></span>` e não `<span />` — HTML não aceita autofechamento
