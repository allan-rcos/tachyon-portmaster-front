import { serverCall, type IncomingHeaders } from '@/services/clients/server';
import { getMetrics as codec } from '@/services/codecs/flow/v1/metrics';

export function getMetrics(headers: IncomingHeaders) {
  return serverCall(codec, {}, headers);
}
