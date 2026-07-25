import { describe, it, expect } from 'vitest';

import { containerCreateSchema, containerUpdateSchema } from './container.schema';
import { loadItemSchema } from './manifest.schema';

describe('container schemas', () => {
  it('create aceita código válido e coage capacidade', () => {
    const r = containerCreateSchema.safeParse({ code: 'MSKU-4410', max_capacity: '28000' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.max_capacity).toBe(28000);
  });

  it('create rejeita código curto e capacidade não positiva', () => {
    expect(containerCreateSchema.safeParse({ code: 'ab', max_capacity: '10' }).success).toBe(false);
    expect(containerCreateSchema.safeParse({ code: 'MSKU-1', max_capacity: '-1' }).success).toBe(
      false,
    );
  });

  it('update valida só capacidade', () => {
    expect(containerUpdateSchema.safeParse({ max_capacity: '5000' }).success).toBe(true);
    expect(containerUpdateSchema.safeParse({ max_capacity: '0' }).success).toBe(false);
  });

  it('loadItem exige produto e quantidade positiva', () => {
    expect(loadItemSchema.safeParse({ product_id: 'prd_soja', quantity: '100' }).success).toBe(
      true,
    );
    expect(loadItemSchema.safeParse({ product_id: '', quantity: '100' }).success).toBe(false);
    expect(loadItemSchema.safeParse({ product_id: 'prd_soja', quantity: '0' }).success).toBe(false);
  });
});
