/**
 * Configuração global do Vike — o que vale para toda rota.
 *
 * As três decisões que moram aqui, e por que não moram em 15 `+config.js` de
 * rota: `lang: 'pt-BR'` (o produto é pt-BR; o padrão do adaptador é `en`),
 * `stream: false` (por escolha — o `renderToString` do vike-lit resolve as
 * Promises do template antes de fechar a string, para qualquer User-Agent) e
 * `meta.data.env`, que roda o hook `data` nos dois lados. O `env` é o mesmo
 * para todas as rotas, então repeti-lo por rota só duplicaria a decisão.
 *
 * @packageDocumentation
 */
import vikeLit from 'vike-lit/config';

export default {
  extends: [vikeLit],

  // O `<head>` deixou de ser montado à mão num `+Head` que lê o pageContext: o
  // `vike-lit` já sabe emitir `<title>`, `og:title`, `description` e
  // `og:description` a partir das configs `title`/`description`, que vivem em
  // `+title.ts` e `+description.ts` (o Vike exige que valor de config seja
  // serializável, então código vai em arquivo próprio). Ambos leem a MESMA
  // origem: o `data.meta` que o `createXPageInput` da rota resolveu no locale
  // da requisição. Ao `+Head.ts` sobrou só o que não tem config própria.

  // O produto é pt-BR. Sem isto o padrão do adaptador é `en`, que é o que a
  // versão em Solid vinha emitindo sem querer.
  lang: 'pt-BR',

  // Sem streaming, como antes — mas agora por escolha e não para contornar o
  // adaptador. O antigo comentário aqui explicava que o `vike-solid` só resolvia
  // um `<Suspense>` em HTML de verdade para bot (`renderToStringAsync`), e que
  // para navegador o stream emitia fallback + `<template>` inerte trocado por
  // script — o que não é "HTML completo na 1ª requisição". Esse dilema não
  // existe mais: o `renderToString` do vike-lit resolve as Promises do template
  // antes de fechar a string, para qualquer User-Agent.
  stream: false,

  meta: {
    // O hook `data` de cada rota roda nos DOIS lados, e é o que sustenta o
    // desenho de SSR do projeto:
    //
    //   server → o `+data` resolve ANTES do render, então o HTML da 1ª
    //            requisição sai completo, para qualquer User-Agent;
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
