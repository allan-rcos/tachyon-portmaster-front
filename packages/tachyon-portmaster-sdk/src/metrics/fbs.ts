import { MetricsResponse as FbMetricsResponse } from '../fbs-gen/api/fbs/metrics/metrics-response';
import { buf, fromT } from '../core/fbs-runtime';

import type { Metrics } from './dto';

export const decMetrics = (b: Uint8Array): Metrics =>
  fromT(FbMetricsResponse.getRootAsMetricsResponse(buf(b)).unpack()) as Metrics;
