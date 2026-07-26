import { describe, it, expect } from 'vitest';

import { productSchema } from './product.schema';

describe('productSchema', () => {
  it('aceita produto válido e coage densidade', () => {
    const r = productSchema.safeParse({ name: 'Café verde', density: '0.67', risk_class: 'None' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.density).toBeCloseTo(0.67);
  });

  it('aceita vírgula decimal — é o que o protótipo mostra', () => {
    const r = productSchema.safeParse({
      name: 'Farelo de soja',
      density: '0,58',
      risk_class: 'None',
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.density).toBeCloseTo(0.58);
  });

  it('rejeita texto que não é número', () => {
    expect(
      productSchema.safeParse({ name: 'Café', density: 'muito', risk_class: 'None' }).success,
    ).toBe(false);
  });

  it('rejeita nome curto, densidade inválida e classe desconhecida', () => {
    expect(productSchema.safeParse({ name: 'x', density: '1', risk_class: 'None' }).success).toBe(
      false,
    );
    expect(
      productSchema.safeParse({ name: 'Café', density: '-1', risk_class: 'None' }).success,
    ).toBe(false);
    expect(
      productSchema.safeParse({ name: 'Café', density: '1', risk_class: 'ClasseX' }).success,
    ).toBe(false);
  });
});
