import { describe, it, expect } from 'vitest';

import { getAccount } from './get-account.query';

const AUTH = { cookie: 'auth_token=mock_usr_ana' };

describe('getAccount loader', () => {
  it('retorna o perfil do usuário autenticado', async () => {
    const p = await getAccount(AUTH);
    expect(p.email).toBe('ana@portmaster.test');
    expect(p.roles.length).toBeGreaterThan(0);
  });

  it('sem sessão → 401', async () => {
    await expect(getAccount(undefined)).rejects.toMatchObject({ status: 401 });
  });
});
