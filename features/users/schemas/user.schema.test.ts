import { describe, it, expect } from 'vitest';

import { userCreateSchema, userUpdateSchema, passwordResetSchema } from './user.schema';

describe('user schemas', () => {
  it('create exige e-mail válido, senha e ao menos um perfil', () => {
    expect(
      userCreateSchema.safeParse({
        name: 'João',
        email: 'joao@x.com',
        initial_password: '123456',
        role_ids: ['r1'],
      }).success,
    ).toBe(true);
    expect(
      userCreateSchema.safeParse({
        name: 'João',
        email: 'nope',
        initial_password: '123456',
        role_ids: ['r1'],
      }).success,
    ).toBe(false);
    expect(
      userCreateSchema.safeParse({
        name: 'João',
        email: 'joao@x.com',
        initial_password: '123',
        role_ids: ['r1'],
      }).success,
    ).toBe(false);
    expect(
      userCreateSchema.safeParse({
        name: 'João',
        email: 'joao@x.com',
        initial_password: '123456',
        role_ids: [],
      }).success,
    ).toBe(false);
  });

  it('update valida nome/email/perfis', () => {
    expect(
      userUpdateSchema.safeParse({ name: 'João', email: 'joao@x.com', role_ids: ['r1'] }).success,
    ).toBe(true);
  });

  it('reset de senha exige mínimo de 6', () => {
    expect(passwordResetSchema.safeParse({ new_password: '123456' }).success).toBe(true);
    expect(passwordResetSchema.safeParse({ new_password: '123' }).success).toBe(false);
  });
});
