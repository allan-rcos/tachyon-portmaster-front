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
  },
  // Raiz redireciona para o painel operacional.
  redirects: {
    '/': '/painel',
  },
  // O <title> é definido dinamicamente em pages/+Head.tsx a partir de
  // `data.title` — não definimos `title` aqui para evitar dois <title>.
};
