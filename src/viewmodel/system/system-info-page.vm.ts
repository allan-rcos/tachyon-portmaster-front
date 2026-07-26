// ============================================================
//  Rota /info — diagnóstico de runtime.
//
//  É a única parte do ViewModel que inspeciona o ambiente de execução, e o faz
//  por detecção de capacidade (`globalThis.tjs`, `globalThis.Bun`), sem importar
//  nada específico de runtime, para continuar válida sob txiki, Bun ou Node.
//
//  Segue o mesmo par das demais rotas (`createXPageInput` + `createXVM`), com
//  duas diferenças: é pública (não chama `authorize`, logo não tem `shell`) e
//  não faz E/S — o dado nasce do próprio processo.
// ============================================================
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import type { PageMeta, PageRequest } from '@viewmodel/core/page/page-request';

import { systemInfoMessages, type SystemInfoText } from './i18n/system-info-page.messages';

/** Identificação e telemetria do processo que está servindo o SSR. */
export interface SystemInfo {
  name: string;
  version: string;
  environment: string;
  runtime: string;
  /** Memória residente em MB. Cru: quem formata é o `PageInput`. */
  memory_usage_mb: number;
}

/** Um par rótulo/valor do painel. O valor é mono — é dado, não prosa. */
export interface InfoFact {
  key: string;
  label: string;
  value: string;
}

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface SystemInfoPageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Texto da tela, já no locale do request. */
  t: SystemInfoText;
  /** Nome do processo, no cabeçalho do painel. */
  processName: string;
  /** Selo do runtime detectado. */
  runtime: string;
  /** Pares rótulo/valor do painel do frontend. */
  facts: readonly InfoFact[];
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

/** Monta o diagnóstico do processo que está servindo o SSR. */
export function readSystemInfo(): SystemInfo {
  return {
    name: 'Tachyon PortMaster',
    version: '0.1.0',
    environment: import.meta.env.PROD ? 'production' : 'development',
    runtime: detectRuntime(),
    memory_usage_mb: readMemoryUsageMb(),
  };
}

/**
 * O trabalho de servidor da rota: i18n e a leitura do próprio processo.
 *
 * @param request Requisição de página, neutra de framework.
 */
export function createSystemInfoPageInput(request: PageRequest): SystemInfoPageInput {
  const t = systemInfoMessages(resolveLocale(request.headers));
  const info = readSystemInfo();

  return {
    meta: { title: t.title, description: t.subtitle },
    t,
    processName: info.name,
    runtime: info.runtime,
    facts: [
      { key: 'version', label: t.version, value: info.version },
      { key: 'environment', label: t.environment, value: info.environment },
      { key: 'runtime', label: t.runtime, value: info.runtime },
      { key: 'memory', label: t.memory, value: `${info.memory_usage_mb} MB` },
    ],
  };
}

/** Superfície do diagnóstico. Sem signals: nada aqui muda depois do load. */
export interface SystemInfoVM {
  /** Texto da tela. */
  t: SystemInfoText;
  /** Nome do processo. */
  processName: string;
  /** Runtime detectado, no selo do cabeçalho. */
  runtime: string;
  /** Pares rótulo/valor. */
  facts: readonly InfoFact[];
}

/**
 * Cria o ViewModel do diagnóstico a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createSystemInfoVM(input: SystemInfoPageInput): SystemInfoVM {
  return {
    t: input.t,
    processName: input.processName,
    runtime: input.runtime,
    facts: input.facts,
  };
}
