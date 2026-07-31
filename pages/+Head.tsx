/**
 * O que sobra do `<head>` depois que `+title` e `+description` assumiram as
 * tags que o `vike-solid` sabe emitir sozinho.
 *
 * @packageDocumentation
 */
import type { JSX } from 'solid-js';

/**
 * `<head>` global e ÚNICO `+Head` — o Vike acumula `+Head` pela árvore de
 * diretórios, e manter um só é o que evita tag duplicada.
 *
 * Aqui mora apenas o que NÃO tem config própria no `vike-solid`. `<title>`,
 * `description`, `og:*` e `viewport` são resolvidos pelo adaptador a partir das
 * configs declaradas em `+config.js`, `+title.ts` e `+description.ts` —
 * repeti-los aqui geraria duplicata. Antes deste corte, o `usePageContext` era
 * lido aqui só para remontar à mão o que o adaptador já sabia montar.
 *
 * App autenticada → `noindex`.
 */
export default function Head(): JSX.Element {
  return (
    <>
      <meta name="color-scheme" content="dark" />
      <meta name="robots" content="noindex" />
    </>
  );
}
