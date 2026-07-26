import { describe, it, expect } from 'vitest';

import { roleSchema, rolePermissionsSchema } from './role.schema';

describe('roleSchema', () => {
  it('aceita perfil com nome e permissões', () => {
    expect(roleSchema.safeParse({ name: 'Auditor', permissions: ['MetricsRead'] }).success).toBe(
      true,
    );
  });

  it('rejeita sem permissões ou nome curto', () => {
    expect(roleSchema.safeParse({ name: 'Auditor', permissions: [] }).success).toBe(false);
    expect(roleSchema.safeParse({ name: 'x', permissions: ['MetricsRead'] }).success).toBe(false);
  });

  it('no modo permissões mantém a forma e não cobra o nome', () => {
    // O nome não é editável ali (nem é enviado), então entra como texto livre —
    // mas continua na FORMA, que é única nos dois modos.
    expect(
      rolePermissionsSchema.safeParse({ name: 'x', permissions: ['MetricsRead'] }).success,
    ).toBe(true);
    expect(rolePermissionsSchema.safeParse({ name: 'Auditor', permissions: [] }).success).toBe(
      false,
    );
  });
});
