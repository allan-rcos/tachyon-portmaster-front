import { getMetrics as apiGetMetrics } from '@model/metrics';
import { metricsFactory } from '@testing/factories/model.factory';
import { describe, expect, it, vi } from 'vitest';

import { getMetrics } from './get-metrics.query';

vi.mock('@model/metrics');

const mockedGet = vi.mocked(apiGetMetrics);

describe('getMetrics', () => {
  it('devolve os indicadores do pátio com a divisão de ocupação', async () => {
    const metrics = metricsFactory.build();
    mockedGet.mockResolvedValueOnce(metrics);

    const res = await getMetrics({ cookie: 'auth_token=abc' });
    expect(res).toEqual(metrics);
    expect(res.occupancy_division).toHaveProperty('sealed');
  });
});
