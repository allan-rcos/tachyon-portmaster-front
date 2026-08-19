/**
 * Rota /info — diagnóstico de runtime.
 *
 * É a única parte do ViewModel que inspeciona o ambiente de execução, e o faz
 * por detecção de capacidade (`globalThis.tjs`, `globalThis.Bun`), sem importar
 * nada específico de runtime, para continuar válida sob txiki, Bun ou Node.
 *
 * Segue o mesmo par das demais rotas (`createXPageInput` + `createXVM`), com uma
 * diferença: é pública — não chama `authorize`, logo não tem `shell`. O `GET
 * /info` do backend também é público, então os dois painéis da tela existem sem
 * sessão.
 *
 * @packageDocumentation
 */
import { getProjectInfo } from '@model/system';
import { resolveClient } from '@viewmodel/core/client/api-client';
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

/**
 * Um painel da tela: um processo e os fatos que ele reporta.
 *
 * Os dois painéis têm a mesma forma porque medem as mesmas coisas — o do
 * frontend só nasce de uma leitura local em vez de uma requisição.
 */
export interface InfoPanel {
  /** Nome do processo, no cabeçalho do painel. */
  processName: string;
  /** Selo do runtime; ausente quando o processo não reporta um. */
  runtime?: string;
  /** Pares rótulo/valor do painel. */
  facts: readonly InfoFact[];
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
  /**
   * O painel do backend; ausente quando o `GET /info` falhou.
   *
   * Opcional de propósito: uma tela de diagnóstico que quebra quando a API está
   * fora perde justamente o diagnóstico que importa naquele momento. API fora é
   * um RESULTADO desta rota, não um erro dela.
   */
  backend?: InfoPanel;
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
 * Os mesmos quatro fatos, medidos em qualquer um dos dois processos.
 *
 * @param info Diagnóstico cru — do próprio processo ou do backend.
 * @param t    Texto já resolvido, para rotular cada fato.
 */
function toFacts(info: SystemInfo, t: SystemInfoText): readonly InfoFact[] {
  return [
    { key: 'version', label: t.version, value: info.version },
    { key: 'environment', label: t.environment, value: info.environment },
    { key: 'runtime', label: t.runtime, value: info.runtime },
    { key: 'memory', label: t.memory, value: `${info.memory_usage_mb} MB` },
  ];
}

/**
 * Lê o `GET /info` do backend, devolvendo `undefined` se ele não responder.
 *
 * Engolir o erro é o comportamento certo AQUI e só aqui: a tela existe para
 * relatar o estado do sistema, e "a API não respondeu" é um desses estados.
 *
 * @param request Requisição de página, para repassar os cabeçalhos no SSR.
 * @param t       Texto já resolvido, para rotular os fatos.
 */
async function readBackendPanel(
  request: PageRequest,
  t: SystemInfoText,
): Promise<InfoPanel | undefined> {
  try {
    const info = await getProjectInfo(resolveClient(request.headers));
    return { processName: info.name, runtime: info.runtime, facts: toFacts(info, t) };
  } catch {
    return undefined;
  }
}

/**
 * O trabalho de servidor da rota: i18n, a leitura do próprio processo e a do
 * backend.
 *
 * @param request Requisição de página, neutra de framework.
 */
export async function createSystemInfoPageInput(
  request: PageRequest,
): Promise<SystemInfoPageInput> {
  const t = request.t(systemInfoMessages);
  const info = readSystemInfo();

  return {
    meta: { title: t.title, description: t.subtitle },
    t,
    processName: info.name,
    runtime: info.runtime,
    facts: toFacts(info, t),
    backend: await readBackendPanel(request, t),
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
  /** Painel do backend; ausente quando a API não respondeu. */
  backend?: InfoPanel;
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
    backend: input.backend,
  };
}
