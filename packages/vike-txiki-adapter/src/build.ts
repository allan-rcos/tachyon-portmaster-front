// Lógica de bundling compartilhada entre a CLI e o plugin de Vite.
//
// Gera um entry efêmero (ligando o build do Vike + `renderPage` + o adapter)
// e o empacota com `Bun.build` num único `dist/txiki/server.mjs` para o `tjs`.
// Requer Bun (usa `Bun.build`/`Bun.write`).
import { existsSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';

declare const Bun: {
  build(options: {
    entrypoints: string[];
    target?: string;
    conditions?: string[];
    define?: Record<string, string>;
  }): Promise<{ success: boolean; logs: unknown[]; outputs: Array<{ kind: string }> }>;
  write(path: string, data: unknown): Promise<number>;
};

export interface BuildOptions {
  /** Entry SSR do Vike. Default: `dist/server/entry.mjs`. */
  entry?: string;
  /** Dir de assets estáticos. Default: `dist/client`. */
  client?: string;
  /** Bundle de saída. Default: `dist/txiki/server.mjs`. */
  out?: string;
  /** Porta padrão (o env `PORT` tem prioridade). Default: 3000. */
  port?: number;
  /** Diretório base. Default: `process.cwd()`. */
  cwd?: string;
  /** Silencia o log de sucesso. Default: false. */
  silent?: boolean;
}

function posix(p: string): string {
  return p.split('\\').join('/');
}

/**
 * Empacota o servidor txiki.js a partir de um build de produção do Vike.
 * Retorna o caminho absoluto do bundle. Lança em caso de erro.
 */
export async function buildTxikiServer(options: BuildOptions = {}): Promise<string> {
  const cwd = options.cwd ?? process.cwd();
  const entryRel = options.entry ?? 'dist/server/entry.mjs';
  const clientRelInput = options.client ?? 'dist/client';
  const outRel = options.out ?? 'dist/txiki/server.mjs';
  const port = options.port ?? 3000;

  const entryAbs = resolve(cwd, entryRel);
  const clientAbs = resolve(cwd, clientRelInput);
  const outAbs = resolve(cwd, outRel);

  if (typeof Bun === 'undefined') {
    throw new Error(
      '[vike-txiki-adapter] requer o runtime do Bun para empacotar. ' +
        'Rode o build sob o Bun (ex.: `bunx --bun vite build`).'
    );
  }

  if (!existsSync(entryAbs)) {
    throw new Error(
      `[vike-txiki-adapter] Build do Vike não encontrado em "${entryRel}". Rode o \`vite build\` antes.`
    );
  }

  // Caminho do dir de assets relativo ao bundle de saída — resolvido em runtime
  // via import.meta.url, mantendo o bundle portável (independente do caminho).
  let clientRel = posix(relative(dirname(outAbs), clientAbs));
  if (!clientRel.endsWith('/')) clientRel += '/';

  // Entry efêmero, escrito dentro de node_modules para resolver os specifiers
  // bare (`vike/server`, `vike-txiki-adapter`) do projeto consumidor.
  const tmpEntry = resolve(cwd, 'node_modules', '.vike-txiki-adapter.entry.mjs');
  const source =
    `import ${JSON.stringify(entryAbs)};\n` +
    `import { renderPage } from 'vike/server';\n` +
    `import { serve } from 'vike-txiki-adapter';\n` +
    `const server = serve({\n` +
    `  renderPage,\n` +
    `  staticDir: new URL(${JSON.stringify(clientRel)}, import.meta.url),\n` +
    `  port: Number(tjs.env.PORT ?? ${port})\n` +
    `});\n` +
    `console.log('▶ vike-txiki-adapter — http://localhost:' + (server.port ?? ${port}));\n`;

  writeFileSync(tmpEntry, source);

  // `NODE_ENV=production` no ambiente do build faz o Bun inlinar produção.
  process.env.NODE_ENV = 'production';

  try {
    const result = await Bun.build({
      entrypoints: [tmpEntry],
      target: 'node',
      conditions: ['worker'],
      define: { 'process.env.NODE_ENV': JSON.stringify('production') }
    });
    if (!result.success) {
      const details = result.logs.map((l) => String(l)).join('\n');
      throw new Error(`[vike-txiki-adapter] Falha no bundle:\n${details}`);
    }
    const artifact =
      result.outputs.find((o) => o.kind === 'entry-point') ?? result.outputs[0]!;
    await Bun.write(outAbs, artifact);
  } finally {
    rmSync(tmpEntry, { force: true });
  }

  if (!options.silent) {
    console.log(`[vike-txiki-adapter] Bundle gerado: ${outRel}`);
  }
  return outAbs;
}
