import { describe, it, expect } from 'vitest';

import { accountSchema, passwordChangeSchema } from './account.schema';

describe('account schemas', () => {
  it('valida nome e e-mail', () => {
    expect(accountSchema.safeParse({ name: 'Ana', email: 'ana@x.com' }).success).toBe(true);
    expect(accountSchema.safeParse({ name: 'Ana', email: 'nope' }).success).toBe(false);
  });

  it('troca de senha exige atual e nova (mín. 6)', () => {
    expect(
      passwordChangeSchema.safeParse({ current_password: 'x', new_password: '123456' }).success,
    ).toBe(true);
    expect(
      passwordChangeSchema.safeParse({ current_password: '', new_password: '123456' }).success,
    ).toBe(false);
    expect(
      passwordChangeSchema.safeParse({ current_password: 'x', new_password: '123' }).success,
    ).toBe(false);
  });
});
