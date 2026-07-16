import type { PageContextServer } from 'vike/types';

export interface SystemInfo {
  name: string;
  version: string;
  environment: string;
  runtime: string;
  memory_usage_mb: number;
}

export interface DataProps {
  frontend: SystemInfo;
}

export async function data(pageContext: PageContextServer): Promise<DataProps> {
  // No futuro, estes dados de infraestrutura e do backend
  // virão de chamadas HTTP aqui.

  // Detecção do runtime WinterTC que está servindo o SSR.
  // `globalThis.tjs` só existe no txiki.js; `Bun` só no Bun; etc.
  const tjs = (globalThis as any).tjs;
  const bun = (globalThis as any).Bun;
  const runtime = tjs
    ? `txiki.js v${tjs.version}`
    : typeof process !== 'undefined' && process.versions?.llrt
      ? "LLRT"
      : bun
        ? `Bun v${bun.version}`
        : "Node";

  // Uso de memória residente (Web Standard/edge-compatível, com fallbacks).
  const memoryUsage = typeof process !== 'undefined' && process.memoryUsage
    ? Math.round(process.memoryUsage().rss / 1024 / 1024)
    : 12; // Fallback aproximado para runtimes isolados (~10MB)

  return {
    frontend: {
      name: "Tychyon Portmaster",
      version: "0.1.0",
      environment: import.meta.env.PROD ? "production" : "development",
      runtime,
      memory_usage_mb: memoryUsage
    }
  };
}