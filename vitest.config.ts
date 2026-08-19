import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { fileURLToPath } from 'node:url';
import solid from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

// Config isolada de testes: usa `vite-plugin-solid` em modo de teste (sem o
// plugin do Vike, que é só para SSR/build de produção). jsdom + jest-dom.
export default defineConfig({
  // `hot: false` desliga a injeção do solid-refresh (HMR), que quebra o
  // transform em ambiente de teste (id virtual `/@solid-refresh`).
  // `paraglideVitePlugin` gera `dist/paraglide/` também nos testes, então os
  // resolvers de rota (que chamam `m.*`) funcionam sob o Vitest.
  plugins: [
    paraglideVitePlugin({
      project: './packages/tachyon-portmaster-i18n/project.inlang',
      outdir: './dist/paraglide',
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
      '@ds-assets': fileURLToPath(new URL('./packages/tachyon-design/assets', import.meta.url)),
      // Aliases por camada — ver tsconfig.json / vite.config.ts.
      '@model': fileURLToPath(new URL('./src/model', import.meta.url)),
      '@viewmodel': fileURLToPath(new URL('./src/viewmodel', import.meta.url)),
      '@view': fileURLToPath(new URL('./src/view', import.meta.url)),
      // Ver vite.config.ts: precisam vir antes de `@`.
      '@/paraglide': fileURLToPath(new URL('./dist/paraglide', import.meta.url)),
      '@/fbs': fileURLToPath(new URL('./dist/fbs', import.meta.url)),
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'packages/**', 'src/model/contract/**'],
    server: {
      deps: {
        inline: [/solid-js/, /@solidjs\/testing-library/, /@tanstack/],
      },
    },
  },
});
