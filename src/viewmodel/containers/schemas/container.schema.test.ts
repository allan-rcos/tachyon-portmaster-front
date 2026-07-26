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

  it('aceita vírgula decimal — é o que o protótipo mostra', () => {
    const r = containerCreateSchema.safeParse({ code: 'MSKU-4410', max_capacity: '28000,5' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.max_capacity).toBeCloseTo(28000.5);
  });

  it('update mantém a forma do formulário e só cobra a capacidade', () => {
    // O código não é editável na edição (nem é enviado), então entra como texto
    // livre — mas continua na FORMA, que é única nos dois modos.
    expect(containerUpdateSchema.safeParse({ code: 'ab', max_capacity: '5000' }).success).toBe(
      true,
    );
    expect(containerUpdateSchema.safeParse({ code: 'MSKU-4410', max_capacity: '0' }).success).toBe(
      false,
    );
  });

  it('loadItem exige produto e quantidade positiva', () => {
    expect(loadItemSchema.safeParse({ product_id: 'prd_soja', quantity: '100' }).success).toBe(
      true,
    );
    expect(loadItemSchema.safeParse({ product_id: '', quantity: '100' }).success).toBe(false);
    expect(loadItemSchema.safeParse({ product_id: 'prd_soja', quantity: '0' }).success).toBe(false);
  });
});
