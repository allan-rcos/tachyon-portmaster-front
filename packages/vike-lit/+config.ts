import type { Config } from 'vike/types';

import { ssrEffect } from './integration/ssrEffect.js';

export default {
  name: 'vike-lit',
  require: {
    vike: '>=0.4.250',
  },

  // Sem `vite.ssr.optimizeDeps` e sem plugin: o Lit não tem compilador. O
  // `vike-solid` precisa de `vite-plugin-solid` + babel; aqui `html\`\`` é
  // tagged template, então `tsc` basta.

  // https://vike.dev/onRenderHtml
  onRenderHtml: 'import:vike-lit/__internal/integration/onRenderHtml:onRenderHtml',
  // https://vike.dev/onRenderClient
  onRenderClient: 'import:vike-lit/__internal/integration/onRenderClient:onRenderClient',

  // https://vike.dev/clientRouting
  clientRouting: true,
  hydrationCanBeAborted: true,

  passToClient: ['_configFromHook'],

  // Sem `staticReplace`: ele existe no vike-solid para arrancar os children do
  // `<ClientOnly>` do bundle do servidor, casando com o `createComponent` do
  // Solid. Aqui o `clientOnly()` recebe um thunk, que simplesmente não é
  // chamado no servidor.

  // https://vike.dev/meta
  meta: {
    Head: {
      env: { server: true },
      cumulative: true,
    },
    Layout: {
      env: { server: true, client: true },
      cumulative: true,
    },
    Wrapper: {
      env: { server: true, client: true },
      cumulative: true,
    },
    title: {
      env: { server: true, client: true },
    },
    description: {
      env: { server: true },
    },
    image: {
      env: { server: true },
    },
    viewport: {
      env: { server: true },
    },
    favicon: {
      env: { server: true },
      global: true,
    },
    lang: {
      env: { server: true, client: true },
    },
    ssr: {
      env: { config: true },
      effect: ssrEffect,
    },
    stream: {
      env: { server: true },
      cumulative: true,
    },
    htmlAttributes: {
      env: { server: true },
      global: true,
      cumulative: true, // for Vike extensions
    },
    bodyAttributes: {
      env: { server: true },
      global: true,
      cumulative: true, // for Vike extensions
    },
    onAfterRenderClient: {
      env: { server: false, client: true },
      cumulative: true,
    },
  },
} satisfies Config;

// Garante que TypeScript carregue as interfaces globais Vike.Config e
// Vike.PageContext — mesmo motivo do vike-solid.
import './types/Config.js';
import './types/PageContext.js';
