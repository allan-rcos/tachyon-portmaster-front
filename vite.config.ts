import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { fileURLToPath } from 'node:url';
import vike from 'vike/plugin';
import { txiki } from 'vike-txiki-adapter/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // Não há plugin de framework de interface aqui, e isso é o ponto: `html``` do
  // Lit é tagged template, então o `tsc`/esbuild do Vite já dá conta. O
  // `vike-solid/vite` (que embrulhava o `vite-plugin-solid`) saiu junto com o
  // Solid — quem ensina o Vike a renderizar Lit é o `packages/vike-lit`, um
  // objeto de config, não um transform.
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
    txiki(),
  ],
  resolve: {
    // Duas instâncias de `lit-html` no mesmo bundle quebram a hidratação em
    // silêncio: o `hydrate()` de uma não reconhece os marcadores da outra.
    // O `dedupe` é o que garante uma só, e precisa estar igual no vitest.config.
    dedupe: ['lit', 'lit-html', '@lit/reactive-element'],
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
