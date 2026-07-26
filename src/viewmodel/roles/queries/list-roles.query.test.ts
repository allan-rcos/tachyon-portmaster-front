import { listRoles as apiListRoles } from '@model/roles';
import { paged } from '@viewmodel/core/testing/factory-support';
import { roleFactory } from '@viewmodel/roles/testing/role.factory';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { listRoles } from './list-roles.query';

vi.mock('@model/roles');

const mockedList = vi.mocked(apiListRoles);
const HEADERS = { cookie: 'auth_token=abc' };

beforeEach(() => {
  mockedList.mockResolvedValue(paged(roleFactory.buildList(3)));
});

describe('listRoles', () => {
  it('aplica o limite padrão', async () => {
    await listRoles(HEADERS);
    expect(mockedList).toHaveBeenCalledWith(expect.anything(), { limit: '50' });
  });

  it('repassa o cursor de paginação', async () => {
    await listRoles(HEADERS, new URLSearchParams({ cursor: '5' }));
    expect(mockedList).toHaveBeenCalledWith(expect.anything(), { limit: '50', cursor: '5' });
  });

  it('devolve os perfis com contagem de usuários e permissões', async () => {
    const res = await listRoles(HEADERS);
    const [first] = res.data;
    expect(first).toHaveProperty('user_count');
    expect(first?.permissions.length).toBeGreaterThan(0);
  });
});
