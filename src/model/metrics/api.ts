import type { Metrics } from './dto';
import { decMetrics } from './fbs';
import type { ApiClient } from '../core/http';
import { wire } from '../core/wire';

export const getMetrics = (c: ApiClient): Promise<Metrics> =>
  wire(c, { method: 'GET', path: '/v1/metrics', decode: decMetrics });
