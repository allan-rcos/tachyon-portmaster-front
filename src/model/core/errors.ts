// ============================================================
//  Erros de transporte. O ofetch lança `FetchError` em respostas
//  não-2xx, com `.status`, `.statusCode`, `.data` (corpo parseado)
//  e `.response`. Reexportamos para o app tratar sem acoplar ao ofetch.
// ============================================================
export { FetchError } from 'ofetch';

/** True para qualquer erro de transporte com um status HTTP. */
export function isApiError(e: unknown): e is { status?: number; statusCode?: number; data?: unknown } {
  return typeof e === 'object' && e !== null && ('status' in e || 'statusCode' in e);
}

/** Extrai o status HTTP de um erro do ofetch (ou undefined). */
export function errorStatus(e: unknown): number | undefined {
  if (!isApiError(e)) return undefined;
  return e.status ?? e.statusCode;
}
