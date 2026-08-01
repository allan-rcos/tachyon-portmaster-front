/**
 * Runtime genérico da ponte JSON(DTO) ↔ FlatBuffers, compartilhado
 * pelos codecs FBS de cada recurso. Só é exercido no wire FBS (prod).
 *
 * • decode: reflexão recursiva sobre o objeto desempacotado (*T),
 *   convertendo camelCase → snake_case e enums numéricos → string.
 * • encode: cada recurso constrói seu *T explicitamente (tipos planos);
 *   aqui ficam só os helpers de serialização e os índices de enum.
 *
 * @packageDocumentation
 */
import type { RiskClass, TelemetryEvent } from '@model/common/dto';
import * as flatbuffers from 'flatbuffers';

import { ContainerStatus as FbContainerStatus } from '@/fbs/api/fbs/common/container-status';
import { RiskClass as FbRiskClass } from '@/fbs/api/fbs/common/risk-class';
import { TelemetryEvent as FbTelemetryEvent } from '@/fbs/api/fbs/common/telemetry-event';

/**
 * Serializa um objeto gerado pelo flatc em bytes prontos para envio.
 *
 * @param t      Instância da classe `*T` gerada pelo flatc.
 * @param t.pack Serializador que o flatc anexa à classe.
 */
export function toBytes(t: { pack(b: flatbuffers.Builder): number }): Uint8Array {
  const b = new flatbuffers.Builder(256);
  b.finish(t.pack(b));
  return b.asUint8Array();
}

/**
 * Envelopa bytes recebidos num ByteBuffer do FlatBuffers.
 *
 * @param bytes Corpo binário da resposta.
 */
export function buf(bytes: Uint8Array): flatbuffers.ByteBuffer {
  return new flatbuffers.ByteBuffer(bytes);
}

// Enums resolvidos por nome de campo (camelCase da classe *T).
//
// A fonte dos valores numéricos são os enums que o `flatc` gera a partir do
// `.fbs` — nunca uma lista mantida à mão. Enum numérico do TS tem mapeamento
// reverso embutido (`FbRiskClass[0] === 'Class1Explosives'`), que é exatamente
// o índice→nome que o decode precisa. Antes isto era `indexOf` sobre os arrays
// de `common/dto`, o que obrigava aquela ordem a espelhar o schema de fio: uma
// reordenação inocente lá corromperia o wire em silêncio.
//
// `event` é a exceção: o mapeamento reverso do flatc daria `'Load'`, mas o
// contrato publica o evento em minúsculas (`load`) — é o valor que a coluna
// guarda e o que o wire JSON entrega SEM passar por aqui. Como os dois wires
// precisam produzir o mesmo DTO, o índice vai para o slug, não para o nome do
// case. Ainda assim a chave numérica vem do enum do flatc, então reordenar o
// `.fbs` não corrompe o wire em silêncio, e um case novo quebra a compilação
// deste `Record` em vez de virar `undefined` na tela.
const TELEMETRY_EVENT_SLUG: Record<FbTelemetryEvent, TelemetryEvent> = {
  [FbTelemetryEvent.Load]: 'load',
  [FbTelemetryEvent.Unload]: 'unload',
};

const ENUM_BY_FIELD: Record<string, Record<number, string>> = {
  status: FbContainerStatus,
  riskClass: FbRiskClass,
  event: TELEMETRY_EVENT_SLUG,
};

function camelToSnake(k: string): string {
  return k.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());
}

/**
 * Converte um objeto FlatBuffers no DTO de domínio equivalente.
 *
 * Traduz camelCase→snake_case e índices de enum de volta para os nomes — a
 * diferença entre o que o flatc gera e o que o resto do código espera.
 *
 * @param value Objeto (ou array) vindo do FlatBuffers.
 */
export function fromT(value: unknown): unknown {
  if (value === null || value === undefined) return undefined;
  if (Array.isArray(value)) return value.map(fromT);
  if (typeof value !== 'object') return value;

  // `unknown` e não `any`: os guardas acima já provaram que aqui é objeto, e
  // toda chamada externa termina em `as <DTO>` — o tipo cru nunca escapa daqui.
  const source = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(source)) {
    const val = source[key];
    const snake = camelToSnake(key);
    if (key in ENUM_BY_FIELD && typeof val === 'number') {
      // Índice fora do enum conhecido = versão da API à frente do cliente;
      // preservar o número cru é mais honesto que gravar `undefined`.
      out[snake] = ENUM_BY_FIELD[key]?.[val] ?? val;
    } else if (Array.isArray(val)) {
      out[snake] = val.map(fromT);
    } else if (val !== null && typeof val === 'object') {
      out[snake] = fromT(val);
    } else if (val !== null) {
      out[snake] = val;
    }
  }
  return out;
}

/**
 * Índice numérico de uma classe de risco (string → enum FBS).
 * @param s Classe de risco.
 */
export const riskIndex = (s: RiskClass): number => FbRiskClass[s];
