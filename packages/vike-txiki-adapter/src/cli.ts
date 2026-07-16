#!/usr/bin/env bun
// CLI do vike-txiki-adapter.
//
// Alternativa explícita ao plugin de Vite (`vike-txiki-adapter/vite`): gera o
// bundle do servidor a partir de um build do Vike, sem nenhum arquivo de
// fiação no projeto. Requer Bun para `build` e `tjs` no PATH para `start`.
//
//   vike-txiki-adapter build   # gera dist/txiki/server.mjs
//   vike-txiki-adapter start   # roda o bundle no txiki.js (tjs)
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildTxikiServer, type BuildOptions } from './build.js';

declare const Bun: {
  spawn(
    cmd: string[],
    options: { stdio: [string, string, string]; env: Record<string, string | undefined> }
  ): { exited: Promise<void>; exitCode: number | null };
};

function parseArgs(argv: string[]): BuildOptions {
  const opts: BuildOptions = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--entry') opts.entry = next()!;
    else if (a === '--client') opts.client = next()!;
    else if (a === '--out') opts.out = next()!;
    else if (a === '--port') opts.port = Number(next());
  }
  return opts;
}

async function build(opts: BuildOptions): Promise<void> {
  try {
    await buildTxikiServer(opts);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}

async function start(opts: BuildOptions): Promise<void> {
  const outAbs = resolve(process.cwd(), opts.out ?? 'dist/txiki/server.mjs');
  if (!existsSync(outAbs)) {
    console.log('[vike-txiki-adapter] Bundle ausente — buildando primeiro…');
    await build(opts);
  }
  const proc = Bun.spawn(['tjs', 'run', outAbs], {
    stdio: ['inherit', 'inherit', 'inherit'],
    env: { ...process.env }
  });
  await proc.exited;
  process.exit(proc.exitCode ?? 0);
}

function help(): void {
  console.log(
    `vike-txiki-adapter — serve um build do Vike no txiki.js\n\n` +
      `Uso:\n` +
      `  vike-txiki-adapter build [opções]   Gera o bundle do servidor\n` +
      `  vike-txiki-adapter start [opções]   Roda o bundle no tjs (builda se faltar)\n\n` +
      `Opções:\n` +
      `  --entry <path>    Entry SSR do Vike   (default: dist/server/entry.mjs)\n` +
      `  --client <path>   Dir de assets       (default: dist/client)\n` +
      `  --out <path>      Bundle de saída     (default: dist/txiki/server.mjs)\n` +
      `  --port <n>        Porta padrão        (default: 3000; PORT env tem prioridade)\n`
  );
}

const [cmd, ...rest] = process.argv.slice(2);
const opts = parseArgs(rest);

if (cmd === 'build') await build(opts);
else if (cmd === 'start' || cmd === 'serve') await start(opts);
else help();
