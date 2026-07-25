import { describe, it, expect } from 'vitest';

import { getMetrics } from './get-metrics.query';

const AUTH = { cookie: 'auth_token=mock_usr_ana' };

describe('getMetrics loader', () => {
  it('retorna métricas agregadas do estado', async () => {
    const m = await getMetrics(AUTH);
    expect(m.total_containers).toBeGreaterThan(0);
    expect(m.registered_products).toBeGreaterThan(0);
    const div = m.occupancy_division;
    expect(div.empty + div.loading + div.sealed + div.in_transit).toBe(m.total_containers);
  });

  it('exige autenticação', async () => {
    await expect(getMetrics(undefined)).rejects.toMatchObject({ status: 401 });
  });
});
