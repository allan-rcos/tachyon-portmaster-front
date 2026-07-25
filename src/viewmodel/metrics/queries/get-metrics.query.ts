import { getMetrics as apiGetMetrics } from '@model/metrics';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

export function getMetrics(headers?: IncomingHeaders) {
  return apiGetMetrics(resolveClient(headers));
}
