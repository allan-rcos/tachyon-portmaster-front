import { defineConfig } from 'vite';
import vike from 'vike/plugin';
import vikeSolid from 'vike-solid/vite';
import { txiki } from 'vike-txiki-adapter/vite';

export default defineConfig({
  // `vike-solid/vite` já embrulha o `vite-plugin-solid` com a configuração
  // de SSR correta (dual build server/client), então não precisamos configurar
  // o plugin do Solid manualmente.
  //
  // `txiki()` engata no `vite build` e gera `dist/txiki/server.mjs` ao final —
  // um único build já produz o servidor pronto para o `tjs`.
  plugins: [vike(), vikeSolid(), txiki()]
});
