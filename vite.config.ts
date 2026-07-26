import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { fileURLToPath } from 'node:url';
import vike from 'vike/plugin';
import vikeSolid from 'vike-solid/vite';
import { txiki } from 'vike-txiki-adapter/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // `vike-solid/vite` já embrulha o `vite-plugin-solid` com a configuração
  // de SSR correta (dual build server/client), então não precisamos configurar
  // o plugin do Solid manualmente.
  //
  // `txiki()` engata no `vite build` e gera `dist/txiki/server.mjs` ao final —
  // um único build já produz o servidor pronto para o `tjs`.
  //
  // `paraglideVitePlugin` compila os catálogos de `packages/tachyon-portmaster-i18n`
  // para funções `m.*()` tree-shakeable em `dist/paraglide/`. A saída é build,
  // então mora no `dist` (já gitignorado) e é alcançada pelo alias `@/paraglide`.
  // O locale é sempre passado explicitamente (`m.foo({}, { locale })`), então
  // `strategy` é só fallback — nada de estado global/AsyncLocalStorage.
  plugins: [
    paraglideVitePlugin({
      project: './packages/tachyon-portmaster-i18n/project.inlang',
      outdir: './dist/paraglide',
      strategy: ['baseLocale'],
      emitTsDeclarations: true,
      // `isServer` sem `import.meta.env` (bare) — o bundle do txiki (rolldown)
      // não resolve `import.meta` nesse passo; `typeof window` é seguro nos dois.
      isServer: "typeof window === 'undefined'",
    }),
    vike(),
    vikeSolid(),
    txiki(),
  ],
  resolve: {
    alias: {
      // Fonte única do design system (tokens/glass/ui em SASS). Para trocar a
      // origem (ex.: Bulma), muda só este alias — as importações `@use '@ds/…'`
      // nos módulos continuam iguais.
      '@ds': fileURLToPath(new URL('./packages/tachyon-design/scss', import.meta.url)),
      // Um alias por camada do MVVM — ver tsconfig.json. Mantenha os três
      // arquivos (tsconfig/vite/vitest) em sincronia.
      '@model': fileURLToPath(new URL('./src/model', import.meta.url)),
      '@viewmodel': fileURLToPath(new URL('./src/viewmodel', import.meta.url)),
      '@view': fileURLToPath(new URL('./src/view', import.meta.url)),
      // Saídas de compilador vivem em `dist/`, mas os specifiers continuam
      // estáveis (`@/paraglide/*`, `@/fbs/*`) — trocar o destino do build não
      // toca em nenhum import. Precisam vir antes de `@`, senão o alias mais
      // genérico vence.
      '@/paraglide': fileURLToPath(new URL('./dist/paraglide', import.meta.url)),
      '@/fbs': fileURLToPath(new URL('./dist/fbs', import.meta.url)),
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
});
