import { lingui } from '@lingui/vite-plugin';
import { fileURLToPath } from 'node:url';
import vike from 'vike/plugin';
import vikeSolid from 'vike-solid/vite';
import { txiki, linguiMacroTs } from 'vike-txiki-adapter/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // `vike-solid/vite` já embrulha o `vite-plugin-solid` com a configuração
  // de SSR correta (dual build server/client), então não precisamos configurar
  // o plugin do Solid manualmente.
  //
  // `txiki()` engata no `vite build` e gera `dist/txiki/server.mjs` ao final —
  // um único build já produz o servidor pronto para o `tjs`.
  plugins: [linguiMacroTs(), vike(), vikeSolid(), txiki(), lingui()],
  resolve: {
    alias: {
      // Fonte única do design system (tokens/glass/ui em SASS). Para trocar a
      // origem (ex.: Bulma), muda só este alias — as importações `@use '@ds/…'`
      // nos módulos continuam iguais.
      '@ds': fileURLToPath(new URL('./packages/tachyon-design/scss', import.meta.url)),
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
});
