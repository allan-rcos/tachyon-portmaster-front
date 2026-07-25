import { getMetrics as apiGetMetrics } from '@model/metrics';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

/**
 * Busca os indicadores do pátio para o painel operacional.
 *
 * @param headers Cabeçalhos do request no SSR; omitir no navegador.
 */
export function getMetrics(headers?: IncomingHeaders) {
  return apiGetMetrics(resolveClient(headers));
}
