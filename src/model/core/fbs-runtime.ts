// ============================================================
//  Runtime genérico da ponte JSON(DTO) ↔ FlatBuffers, compartilhado
//  pelos codecs FBS de cada recurso. Só é exercido no wire FBS (prod).
//
//   • decode: reflexão recursiva sobre o objeto desempacotado (*T),
//     convertendo camelCase → snake_case e enums numéricos → string.
//   • encode: cada recurso constrói seu *T explicitamente (tipos planos);
//     aqui ficam só os helpers de serialização e os índices de enum.
// ============================================================
import * as flatbuffers from 'flatbuffers';

import {
  CONTAINER_STATUS,
  RISK_CLASS,
  TELEMETRY_EVENT,
  PERMISSION,
  type RiskClass,
  type Permission,
} from '../common/dto';

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
const ENUM_BY_FIELD: Record<string, readonly string[]> = {
  status: CONTAINER_STATUS,
  riskClass: RISK_CLASS,
  event: TELEMETRY_EVENT,
};
const ENUM_LIST_BY_FIELD: Record<string, readonly string[]> = {
  permissions: PERMISSION,
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
export function fromT(value: any): any {
  if (value === null || value === undefined) return undefined;
  if (Array.isArray(value)) return value.map(fromT);
  if (typeof value !== 'object') return value;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const out: Record<string, any> = {};
  for (const key of Object.keys(value)) {
    const val = value[key];
    const snake = camelToSnake(key);
    if (key in ENUM_BY_FIELD && typeof val === 'number') {
      // Índice fora do enum conhecido = versão da API à frente do cliente;
      // preservar o número cru é mais honesto que gravar `undefined`.
      out[snake] = ENUM_BY_FIELD[key]?.[val] ?? val;
    } else if (key in ENUM_LIST_BY_FIELD && Array.isArray(val)) {
      out[snake] = val.map((n: number) => ENUM_LIST_BY_FIELD[key]?.[n] ?? n);
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
export const riskIndex = (s: RiskClass): number => RISK_CLASS.indexOf(s);
/**
 * Índices numéricos de permissões (string[] → enum FBS[]).
 * @param ps Permissões a converter.
 */
export const permIndexes = (ps: Permission[]): number[] => ps.map((p) => PERMISSION.indexOf(p));
