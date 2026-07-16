// Plugin de Vite do vike-txiki-adapter.
//
// Integra a geração do servidor txiki.js ao `vite build` — assim, como um
// adapter do SvelteKit/Nuxt, um único `vite build` já produz
// `dist/txiki/server.mjs`, sem passo/CLI separado.
//
//   // vite.config.ts
//   import { txiki } from 'vike-txiki-adapter/vite';
//   export default { plugins: [vike(), vikeSolid(), txiki()] };
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildTxikiServer, type BuildOptions } from './build.js';

/** Subconjunto de um Plugin do Vite (evita depender do pacote `vite`). */
interface VitePlugin {
  name: string;
  apply?: 'build' | 'serve';
  enforce?: 'pre' | 'post';
  closeBundle?: () => void | Promise<void>;
}

// O bundle usa `Bun.build`. Quando o `vite build` roda sob Node (o bin do Vite
// tem shebang node), delegamos ao binário `bun` executando a CLI do adapter.
function buildViaBunCli(cwd: string, options: BuildOptions): Promise<void> {
  const cli = fileURLToPath(new URL('./cli.mjs', import.meta.url));
  const args = [cli, 'build'];
  if (options.entry) args.push('--entry', options.entry);
  if (options.client) args.push('--client', options.client);
  if (options.out) args.push('--out', options.out);
  if (options.port != null) args.push('--port', String(options.port));
  return new Promise((res, rej) => {
    const proc = spawn('bun', args, { stdio: 'inherit', cwd });
    proc.on('error', rej);
    proc.on('exit', (code) =>
      code === 0 ? res() : rej(new Error(`[vike-txiki-adapter] bun saiu com código ${code}`))
    );
  });
}

/**
 * Plugin que empacota o servidor txiki.js ao final do `vite build`.
 *
 * O Vike faz dois builds (client e server); o plugin dispara no `closeBundle`
 * de cada um mas só age quando o entry SSR (`dist/server/entry.mjs`) já existe
 * — ou seja, após o build do servidor. Requer Bun (direto ou no PATH).
 */
export function txiki(options: BuildOptions = {}): VitePlugin {
  let done = false;
  return {
    name: 'vike-txiki-adapter',
    apply: 'build',
    enforce: 'post',
    async closeBundle() {
      if (done) return;
      const cwd = options.cwd ?? process.cwd();
      const entryAbs = resolve(cwd, options.entry ?? 'dist/server/entry.mjs');
      // Ainda não é o build do servidor (ex.: terminou o do client).
      if (!existsSync(entryAbs)) return;
      done = true;

      if (typeof (globalThis as { Bun?: unknown }).Bun !== 'undefined') {
        await buildTxikiServer(options); // já sob Bun: bundle no mesmo processo
      } else {
        await buildViaBunCli(cwd, options); // sob Node: delega ao `bun`
      }
    }
  };
}

export default txiki;
