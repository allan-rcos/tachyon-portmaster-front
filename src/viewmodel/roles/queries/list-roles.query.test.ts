import { listRoles as apiListRoles } from '@model/roles';
import { paged, roleFactory } from '@testing/factories/model.factory';
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
    expect(res.data[0]).toHaveProperty('user_count');
    expect(res.data[0].permissions.length).toBeGreaterThan(0);
  });
});
