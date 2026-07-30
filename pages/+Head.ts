/**
 * O que sobra do `<head>` depois que `+title` e `+description` assumiram
 * as tags que o `vike-lit` sabe emitir sozinho: favicon, viewport e o resto do
 * que não tem config própria.
 *
 * @packageDocumentation
 */
import { html } from 'lit';
import type { Renderable } from 'vike-lit/types';

/**
 * `<head>` global e ÚNICO `+Head` — o Vike acumula `+Head` pela árvore de
 * diretórios, e manter um só é o que evita tag duplicada.
 *
 * Aqui mora apenas o que NÃO tem config própria no `vike-lit`. `<title>`,
 * `description`, `og:*` e `viewport` são resolvidos pelo adaptador a partir das
 * configs declaradas em `+config.js` — repeti-los aqui geraria duplicata.
 *
 * App autenticada → `noindex`.
 */
export default function Head(): Renderable {
  return html`
    <meta name="color-scheme" content="dark" />
    <meta name="robots" content="noindex" />
  `;
}
