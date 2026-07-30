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
  ssr: {
    // ============================================================
    //  Por que o `@lit-labs/ssr-client` é forçado para a variante SEM `node/`.
    //
    //  O `@lit-labs/ssr` importa `digestForTemplateResult` do `ssr-client`
    //  (`lib/render-value.js:7`) para gerar o marcador `<!--lit-part HASH-->`.
    //  O package tem duas implementações da MESMA função, escolhidas por
    //  condição de exports:
    //
    //    node/  → `Buffer.from(s, 'binary').toString('base64')`
    //    default → `btoa(s)`
    //
    //  A saída é idêntica; o que muda é a API usada. O txiki não tem `buffer`,
    //  então a variante `node/` derruba o servidor no boot, antes de qualquer
    //  requisição: `ReferenceError: could not load 'buffer'`.
    //
    //  E a escolha não estava sob nosso controle: o Vite deixa `@lit-labs/ssr`
    //  externo, então quem resolvia a cadeia era o `Bun.build` do
    //  `vike-txiki-adapter` — que aplica a condição `node` por ser um bundler de
    //  servidor. `noExternal` traz a resolução de volta para o Vite, e o alias
    //  aponta o arquivo exato.
    //
    //  Cuidado ao mexer: o digest tem de casar entre servidor e cliente, senão a
    //  hidratação falha com "Hydration value mismatch". As duas variantes casam
    //  — trocar por uma terceira implementação não casaria.
    // ============================================================
    noExternal: ['@lit-labs/ssr', '@lit-labs/ssr-client'],
    resolve: {
      conditions: ['worker', 'browser', 'default'],
    },
  },
});
