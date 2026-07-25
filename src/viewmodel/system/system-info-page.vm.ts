// ============================================================
//  Diagnóstico de runtime da rota /info. É a única parte do ViewModel que
//  inspeciona o ambiente de execução — e o faz por detecção de capacidade
//  (`globalThis.tjs`, `globalThis.Bun`), sem importar nada específico de
//  runtime, para continuar válida sob txiki, Bun ou Node.
// ============================================================
import type { PageMeta } from '../core/page/page-request';

/** Identificação e telemetria do processo que está servindo o SSR. */
export interface SystemInfo {
  name: string;
  version: string;
  environment: string;
  runtime: string;
  memory_usage_mb: number;
}

/** Dados que a rota /info entrega à View. */
export interface SystemInfoPageData extends PageMeta {
  frontend: SystemInfo;
}

/** Fallback de memória para runtimes isolados que não expõem RSS (~10 MB). */
const FALLBACK_MEMORY_MB = 12;

/** Detecta o runtime WinterTC que está executando o SSR. */
function detectRuntime(): string {
  const g = globalThis as { tjs?: { version: string }; Bun?: { version: string } };
  if (g.tjs) return `txiki.js v${g.tjs.version}`;
  if (typeof process !== 'undefined' && process.versions?.llrt) return 'LLRT';
  if (g.Bun) return `Bun v${g.Bun.version}`;
  return 'Node';
}

/** Lê o uso de memória residente, com fallback quando indisponível. */
function readMemoryUsageMb(): number {
  return typeof process !== 'undefined' && process.memoryUsage
    ? Math.round(process.memoryUsage().rss / 1024 / 1024)
    : FALLBACK_MEMORY_MB;
}

/** Monta o diagnóstico de runtime exibido em /info. */
export function loadSystemInfoPage(): SystemInfoPageData {
  return {
    frontend: {
      name: 'Tachyon PortMaster',
      version: '0.1.0',
      environment: import.meta.env.PROD ? 'production' : 'development',
      runtime: detectRuntime(),
      memory_usage_mb: readMemoryUsageMb(),
    },
    title: 'Informações do sistema',
    description: 'Diagnóstico de runtime e telemetria de infraestrutura ativa.',
  };
}
