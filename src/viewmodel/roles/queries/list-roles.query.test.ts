import { describe, it, expect } from 'vitest';

import { listRoles } from './list-roles.query';

const AUTH = { cookie: 'auth_token=mock_usr_ana' };

describe('listRoles loader', () => {
  it('lista perfis com permissões e contagem de usuários', async () => {
    const res = await listRoles(AUTH);
    expect(res.data.length).toBeGreaterThan(0);
    const admin = res.data.find((r) => r.name === 'Administrador');
    expect(admin?.permissions.length).toBeGreaterThan(0);
    expect(admin).toHaveProperty('user_count');
  });
});
