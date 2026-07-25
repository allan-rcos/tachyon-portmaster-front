# Adicionar uma página

Para uma rota sobre dados que **já existem** no Model. Se o recurso ainda não
existe, comece por [criar uma feature](add-feature.md).

## 1. O ViewModel da rota

`src/viewmodel/<feature>/<rota>.vm.ts`, exportando a factory e o meta:

```ts
/** Superfície observável da tela. */
export interface MinhaTelaVM {
  t: MinhaTelaText;
  boundary: AsyncBoundaryText; /* … */
}

/**
 * Cria o ViewModel da tela.
 *
 * @param context Contexto de execução — navegador quando omitido.
 */
export function createMinhaTelaVM(context: VMContext = {}): MinhaTelaVM {
  /* … */
}

/**
 * Título e descrição da rota, para o `<head>`.
 *
 * @param context Contexto de execução — só o locale importa aqui.
 */
export function minhaTelaMeta(context: VMContext = {}): PageMeta {
  /* … */
}
```

Rota com parâmetro? Use `routeParam(context, 'id')` — ele falha alto se o
segmento não estiver declarado, em vez de propagar `undefined`.

## 2. A tela na View

`src/view/<feature>/screens/MinhaTelaScreen.tsx`, ligando o VM ao componente
puro com `createScreenBinding` + `AsyncBoundary`.

## 3. Os arquivos do Vike

```
pages/painel/minha-rota/
  +Page.tsx          instancia o VM, envolve em <ClientOnly>
  +routeMeta.ts      export { minhaTelaMeta as default } from '@viewmodel/…'
  +permissions.js    export default ['MinhaPermissao'];
```

Rota com parâmetro precisa repassar `routeParams`:

```tsx
const vm = createMinhaTelaVM({
  url: pageContext.urlOriginal,
  routeParams: pageContext.routeParams,
});
```

## Página pública (com SSR e dados)

`/painel/**` renderiza no navegador porque a app é `noindex` — o servidor só
roda o guard. Uma rota **pública**, onde o SEO importa, mantém `+data.ts`:

```ts
import type { PageContextServer } from 'vike/types';

import { toPageRequest } from '@viewmodel/core/page/page-request';
import { loadMinhaPagina, type MinhaPaginaData } from '@viewmodel/…/minha-pagina.vm';

export type Data = MinhaPaginaData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadMinhaPagina(toPageRequest(pageContext));
```

Com `+data`, o `<head>` sai de `data.title`/`data.description` e o `+routeMeta`
é dispensável — o `+Head` aceita as duas origens.

## Levar uma rota de `/painel` de volta ao SSR

Chame o mesmo ViewModel dentro de um `+data.ts`, passando os headers:

```ts
export const data = async (pageContext: PageContextServer) => {
  const vm = createMinhaTelaVM({
    headers: pageContext.headers, // ← só isto muda o lado
    url: pageContext.urlOriginal,
    routeParams: pageContext.routeParams,
  });
  await vm.load();
  return { items: vm.recurso.data(), t: vm.t, title: minhaTelaMeta().title };
};
```

O ViewModel não muda: `resolveClient` passa a usar o cliente de loopback e
`contextLocale` passa a ler o header em vez do `document.cookie`.

## Erros de domínio

O ViewModel sinaliza ausência com `PageNotFoundError`. Traduzir para HTTP é
trabalho da casca:

```ts
try {
  return await loadMinhaPagina(toPageRequest(pageContext));
} catch (error) {
  if (error instanceof PageNotFoundError) throw render(404);
  throw error;
}
```

> Em rota client-side não há status HTTP a emitir: o `AsyncBoundary` mostra o
> estado de erro.

## O que NÃO fazer em `pages/`

- Declarar componente ou markup → vai para `src/view/<feature>/components/`
- Importar `.scss` → vai junto do componente na View
- Importar `@model/*` → o lint reprova
- Colocar regra de negócio no `+data.ts` → ela pertence ao `*.vm.ts`
