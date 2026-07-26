import type { ApiClient } from '@model/core/http';
import { wire } from '@model/core/wire';

import type { Metrics } from './dto';
import { decMetrics } from './fbs';

export const getMetrics = (c: ApiClient): Promise<Metrics> =>
  wire(c, { method: 'GET', path: '/v1/metrics', decode: decMetrics });
