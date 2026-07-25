import { describe, it, expect } from 'vitest';

import { getContainerSummary } from './get-container-summary.query';
import { listContainers } from './list-containers.query';

const AUTH = { cookie: 'auth_token=mock_usr_ana' };

describe('containers loaders', () => {
  it('lista com paginação por cursor', async () => {
    const res = await listContainers(AUTH, new URLSearchParams({ limit: '3' }));
    expect(res.data).toHaveLength(3);
    expect(res.next_cursor).toBe('3');
  });

  it('filtra por status', async () => {
    const res = await listContainers(AUTH, new URLSearchParams({ status: 'Sealed' }));
    expect(res.data.every((c) => c.status === 'Sealed')).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('filtra por busca de código', async () => {
    const res = await listContainers(AUTH, new URLSearchParams({ search: 'msku' }));
    expect(res.data.every((c) => c.code.toLowerCase().includes('msku'))).toBe(true);
  });

  it('resumo traz container + manifesto + logs', async () => {
    const s = await getContainerSummary('ctr_msku4410', AUTH);
    expect(s.container.code).toBe('MSKU-4410');
    expect(s.manifest.length).toBeGreaterThan(0);
    expect(s.recent_logs.length).toBeGreaterThan(0);
  });

  it('resumo de id inexistente → 404', async () => {
    await expect(getContainerSummary('ctr_nope', AUTH)).rejects.toMatchObject({ status: 404 });
  });
});
