import { describe, it, expect } from 'vitest';

import { getUser } from './get-user.query';
import { listUsers } from './list-users.query';

const AUTH = { cookie: 'auth_token=mock_usr_ana' };

describe('users loaders', () => {
  it('lista usuários com seus perfis', async () => {
    const res = await listUsers(AUTH);
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0].roles.length).toBeGreaterThan(0);
    // não deve vazar senha
    expect((res.data[0] as unknown as Record<string, unknown>).password).toBeUndefined();
  });

  it('obtém um usuário por id', async () => {
    const u = await getUser('usr_bruno', AUTH);
    expect(u.email).toBe('bruno@portmaster.test');
  });
});
