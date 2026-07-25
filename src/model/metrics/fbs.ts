import type { Metrics } from './dto';
import { buf, fromT } from '../core/fbs-runtime';
import { MetricsResponse as FbMetricsResponse } from '../generated/fbs/api/fbs/metrics/metrics-response';


export const decMetrics = (b: Uint8Array): Metrics =>
  fromT(FbMetricsResponse.getRootAsMetricsResponse(buf(b)).unpack()) as Metrics;
