import { buf, fromT } from '@model/core/fbs-runtime';

import type { Metrics } from './dto';

import { MetricsResponse as FbMetricsResponse } from '@/fbs/api/fbs/metrics/metrics-response';

export const decMetrics = (b: Uint8Array): Metrics =>
  fromT(FbMetricsResponse.getRootAsMetricsResponse(buf(b)).unpack()) as Metrics;
