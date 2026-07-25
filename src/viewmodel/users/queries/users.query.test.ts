import { getUser as apiGetUser, listUsers as apiListUsers } from '@model/users';
import { paged, userFactory } from '@testing/factories/model.factory';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getUser } from './get-user.query';
import { listUsers } from './list-users.query';

vi.mock('@model/users');

const mockedList = vi.mocked(apiListUsers);
const mockedGet = vi.mocked(apiGetUser);
const HEADERS = { cookie: 'auth_token=abc' };

beforeEach(() => {
  mockedList.mockResolvedValue(paged(userFactory.buildList(3)));
  mockedGet.mockResolvedValue(userFactory.build());
});

describe('listUsers', () => {
  it('aplica o limite padrão', async () => {
    await listUsers(HEADERS);
    expect(mockedList).toHaveBeenCalledWith(expect.anything(), { limit: '50' });
  });

  it('devolve os usuários com seus perfis', async () => {
    const page = paged(userFactory.buildList(2));
    mockedList.mockResolvedValueOnce(page);

    const res = await listUsers(HEADERS);
    expect(res.data).toHaveLength(2);
    expect(res.data[0].roles.length).toBeGreaterThan(0);
  });
});

describe('getUser', () => {
  it('busca pelo id opaco', async () => {
    const user = userFactory.build({ id: 'usr_ana' });
    mockedGet.mockResolvedValueOnce(user);

    await expect(getUser('usr_ana', HEADERS)).resolves.toEqual(user);
    expect(mockedGet).toHaveBeenCalledWith(expect.anything(), 'usr_ana');
  });
});
