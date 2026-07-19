import { dec } from '@/services/fbs';
import type { Metrics } from '@/services/gen/flow/v1/metrics';
import type { Codec, CallArgs } from '@/services/http';

export const getMetrics: Codec<CallArgs, Metrics> = {
  method: 'GET',
  path: () => '/v1/metrics',
  encode: () => undefined,
  decode: (raw) => raw as Metrics,
  fbsDecode: dec.metrics,
};
