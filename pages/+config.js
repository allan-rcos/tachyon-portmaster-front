// pages/+config.js
// @ts-expect-error — vike-solid/config não expõe tipos
import vikeSolid from 'vike-solid/config';

export default {
  extends: [vikeSolid],

  // O `<head>` deixou de ser montado à mão num `+Head` que lê o pageContext: o
  // `vike-solid` já sabe emitir `<title>`, `og:title`, `description` e
  // `og:description` a partir das configs `title`/`description`, que vivem em
  // `+title.ts` e `+description.ts` (o Vike exige que valor de config seja
  // serializável, então código vai em arquivo próprio). Ambos leem a MESMA
  // origem: o `data.meta` que o `createXPageInput` da rota resolveu no locale
  // da requisição. Ao `+Head.tsx` sobrou só o que não tem config própria.

  // O produto é pt-BR. Sem isto o padrão do `vike-solid` é `en`, que é o que
  // vínhamos emitindo em `<html lang>` sem querer.
  lang: 'pt-BR',

  // Sem `stream`: o `vike-solid` só resolve um `<Suspense>` em HTML de verdade
  // quando o User-Agent é bot (onRenderHtml.js — caminho `renderToStringAsync`).
  // Para navegadores reais o stream emite o fallback + um `<template>` inerte
  // trocado por script em runtime, o que não é "HTML completo na 1ª
  // requisição". Medido em 2026-07-26. Os dados vêm do `+data` de cada rota,
  // que resolve ANTES do render — aí o `renderToString` síncrono já encontra
  // tudo pronto, para qualquer User-Agent e sem depender de JS.
  meta: {
    // O hook `data` de cada rota roda nos DOIS lados, e é o que sustenta o
    // desenho de SSR do projeto:
    //
    //   server → o `+data` resolve ANTES do render, então o `renderToString`
    //            síncrono do vike-solid já encontra os dados prontos e o HTML
    //            da 1ª requisição sai completo, para qualquer User-Agent;
    //   client → a função vai no bundle, então a navegação client-side resolve
    //            no navegador e NÃO gera requisição de página ao servidor.
    //
    // Declarado aqui, e não em 15 `+config.js` de rota: o `env` é o mesmo para
    // todas, e um `+config.js` por rota só repetiria a mesma decisão.
    data: {
      env: { server: true, client: true },
    },
  },
  // Raiz redireciona para o painel operacional.
  redirects: {
    '/': '/painel',
  },
};
