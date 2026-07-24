import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { fileURLToPath } from 'node:url';
import solid from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

// Config isolada de testes: usa `vite-plugin-solid` em modo de teste (sem o
// plugin do Vike, que é só para SSR/build de produção). jsdom + jest-dom.
export default defineConfig({
  // `hot: false` desliga a injeção do solid-refresh (HMR), que quebra o
  // transform em ambiente de teste (id virtual `/@solid-refresh`).
  // `paraglideVitePlugin` gera `paraglide/` também nos testes, então os
  // resolvers de rota (que chamam `m.*`) funcionam sob o Vitest.
  plugins: [
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './paraglide',
      strategy: ['baseLocale'],
      emitTsDeclarations: true,
      isServer: "typeof window === 'undefined'",
    }),
    solid({ hot: false }),
  ],
  resolve: {
    conditions: ['development', 'browser'],
    alias: {
      // Fonte única do design system — ver vite.config.ts. Trocar aqui e no
      // vite.config muda a origem dos estilos (ex.: Bulma) sem tocar módulos.
      '@ds': fileURLToPath(new URL('./packages/tachyon-design/scss', import.meta.url)),
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    // URLs absolutas para os clients: o fetch do Node (undici) não aceita URL
    // relativa (/api). MSW intercepta qualquer host, então localhost serve.
    env: {
      PUBLIC_ENV__API_BASE_URL: 'http://localhost/api',
      PUBLIC_ENV__API_SERVER_URL: 'http://localhost:8080',
    },
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'packages/**'],
    server: {
      deps: {
        inline: [/solid-js/, /@solidjs\/testing-library/, /@tanstack/],
      },
    },
  },
});
