import { describe, it, expect } from 'vitest';

import { roleSchema } from './role.schema';

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
});
