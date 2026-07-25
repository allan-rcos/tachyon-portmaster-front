// pages/+config.js
// @ts-expect-error — vike-solid/config não expõe tipos
import vikeSolid from 'vike-solid/config';

export default {
  extends: [vikeSolid],
  description: 'Sistema de Alocação de Contêineres e Carga',
  // Config custom por página: cada rota declara em `+permissions.js` as
  // permissões (Permission[]) exigidas; o `pages/+guard.ts` lê
  // `pageContext.config.permissions` e emite 403 quando faltarem. `env.server`
  // porque a checagem roda só no SSR (nunca vai ao bundle do cliente).
  meta: {
    permissions: {
      env: { server: true },
    },
    // Meta da rota (<title>/<description>). Cada página declara em `+meta.ts`
    // uma função `(context) => PageMeta` vinda do seu ViewModel — função, e não
    // string, porque o texto depende do locale, que só se conhece no request.
    //
    // `env.client` também, porque as telas de /painel renderizam no navegador:
    // sem +data, é este config que alimenta o <head>. É um import de verdade no
    // bundle, não serialização — por isso uma função é aceitável aqui.
    routeMeta: {
      env: { server: true, client: true },
    },
  },
  // Raiz redireciona para o painel operacional.
  redirects: {
    '/': '/painel',
  },
  // O <title> é definido dinamicamente em pages/+Head.tsx a partir de
  // `data.title` — não definimos `title` aqui para evitar dois <title>.
};
