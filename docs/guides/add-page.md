# Adicionar uma página

Para uma rota sobre dados que **já existem** no Model. Se o recurso ainda não
existe, comece por [criar uma feature](add-feature.md).

Toda rota tem a mesma forma: um `+data` que resolve tudo no servidor, e um
`+Page` que compõe. Não há rota "client-side" com carregamento na tela — quando a
tela renderiza, o dado já existe.

## 1. Os dois papéis, no `*.vm.ts` da rota

`src/viewmodel/<feature>/<rota>.vm.ts` exporta duas coisas:

```ts
/** Permissões que a rota exige. */
export const MINHA_ROTA_PERMISSIONS = ['recurso:acao'] as const;

/** Tudo que a tela precisa. Resolvido ANTES do ViewModel, e serializável. */
export interface MinhaRotaPageInput {
  meta: PageMeta; // `<title>`/`<description>`
  shell: ShellIdentity; // rodapé da barra lateral
  t: MinhaRotaText; // texto no locale da requisição
  items: readonly MinhaLinha[]; // dado JÁ FORMATADO
}

/**
 * O trabalho de servidor: autoriza, resolve i18n, busca e formata.
 *
 * @param request Requisição de página, neutra de framework.
 */
export async function createMinhaRotaPageInput(
  request: PageRequest,
): Promise<MinhaRotaPageInput> {
  const account = await authorize(request, MINHA_ROTA_PERMISSIONS);
  const locale = resolveLocale(request.headers);
  const t = minhaRotaMessages(locale);
  const page = await listMinhaCoisa(request.headers);

  return {
    meta: { title: t.title, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    items: page.data.map((x) => toLinha(x, locale)),
  };
}

/** A reatividade: recebe o que o data resolveu e devolve sinais + ações. */
export function createMinhaRotaVM(input: MinhaRotaPageInput): MinhaRotaVM {
  /* … */
}
```

Permissão é **slug** `recurso:ação` em inglês, com hífen quando a ação tem mais
de uma palavra (`'product:create'`, `'role:update-permissions'`), servido em
runtime por `GET /metadata/permissions` — não há enum a importar. Ver
[`src/model/README.md`](../../src/model/README.md).

Rota com parâmetro? Use `routeParam(request, 'id')` — ele falha alto se o
segmento não estiver declarado, em vez de propagar `undefined`.

**Formatar é aqui.** Pesos, datas e percentuais saem como string. A View não usa
`Intl`.

## 2. A tela na View

`src/view/<feature>/screens/MinhaRotaScreen.tsx` — componente stateless que
recebe o VM:

```tsx
export function MinhaRotaScreen(props: { vm: MinhaRotaVM }): JSX.Element {
  return <MinhaRotaLista vm={props.vm} />;
}
```

## 3. Os arquivos do Vike

```
pages/painel/minha-rota/
  +data.ts     delega ao `createMinhaRotaPageInput` via `toPageInput`
  +Page.tsx    constrói o VM e devolve a tela
```

Não há mais `+permissions.js` (a permissão é declarada pela rota) nem
`+routeMeta.ts` (o `<head>` sai de `data.meta`, via `pages/+title.ts` e
`pages/+description.ts`).

`+data.ts`:

```ts
import { createMinhaRotaPageInput } from '@viewmodel/<feature>/minha-rota.vm';
import type { PageContext } from 'vike/types';

import { toPageInput } from '@/pages/pageInput';

export { data };

/**
 * Trabalho de servidor da rota, resolvido ANTES do render.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
async function data(pageContext: PageContext) {
  return toPageInput(pageContext, createMinhaRotaPageInput);
}
```

`+Page.tsx`:

```tsx
export default function Page(): JSX.Element {
  const vm = createMinhaRotaVM(useData<MinhaRotaPageInput>());
  return <MinhaRotaScreen vm={vm} />;
}
```

O corpo do componente roda **uma vez** por montagem, e é isso que faz o estado do
VM (formulário digitado, páginas já trazidas pelo cursor) sobreviver aos
re-renders. Construir o VM dentro do JSX o recriaria zerado a cada tecla.

## Erros de domínio

O `createXPageInput` lança erro de domínio; traduzir para HTTP é trabalho de
`pages/pageInput.ts`, que já faz isso para todas as rotas:

| erro de domínio     | resposta                         |
| ------------------- | -------------------------------- |
| `UnauthorizedError` | `redirect('/entrar?redirect=…')` |
| `ForbiddenError`    | `render(403)`                    |
| `PageNotFoundError` | `render(404)`                    |

Por isso um id que não resolve deve virar `PageNotFoundError` no ViewModel:

```ts
const produto = await getProduct(id, request.headers).catch(() => {
  throw new PageNotFoundError(`Produto não encontrado: ${id}`);
});
```

## O que NÃO fazer em `pages/`

- Declarar componente ou markup → vai para `src/view/<feature>/components/`
- Importar `.scss` → vai junto do componente na View (a exceção é o
  `global.scss` no `+Layout.tsx`)
- Importar `@model/*` → o lint reprova
- Colocar regra de negócio no `+data.ts` → ela pertence ao `*.vm.ts`
- Guardar estado → o VM guarda; o `+Page` só compõe
