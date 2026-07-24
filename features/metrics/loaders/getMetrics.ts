import { getMetrics as apiGetMetrics } from 'tachyon-portmaster-sdk/metrics';

import { serverClient, type IncomingHeaders } from '@/features/core/api/client';

export function getMetrics(headers: IncomingHeaders) {
  return apiGetMetrics(serverClient(headers));
}
