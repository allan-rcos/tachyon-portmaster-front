import { describe, it, expect } from 'vitest';

import { loginSchema } from './login.schema';

describe('loginSchema', () => {
  it('aceita credenciais válidas', () => {
    expect(loginSchema.safeParse({ email: 'ana@x.com', password: '123' }).success).toBe(true);
  });

  it('rejeita e-mail inválido e senha vazia', () => {
    const r = loginSchema.safeParse({ email: 'nope', password: '' });
    expect(r.success).toBe(false);
  });
});
