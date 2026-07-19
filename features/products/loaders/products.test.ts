import { describe, it, expect } from 'vitest';

import { getProduct } from './getProduct';
import { listProducts } from './listProducts';

const AUTH = { cookie: 'auth_token=mock_usr_ana' };

describe('products loaders', () => {
  it('lista o catálogo', async () => {
    const res = await listProducts(AUTH);
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0]).toHaveProperty('risk_class');
  });

  it('busca por nome', async () => {
    const res = await listProducts(AUTH, new URLSearchParams({ search: 'diesel' }));
    expect(res.data.every((p) => p.name.toLowerCase().includes('diesel'))).toBe(true);
  });

  it('obtém um produto por id', async () => {
    const p = await getProduct('prd_soja', AUTH);
    expect(p.name).toBe('Farelo de soja');
  });
});
