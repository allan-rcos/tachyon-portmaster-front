import { getAccount as apiGetAccount } from '@model/account';
import { accountProfileFactory } from '@viewmodel/account/testing/account.factory';
import { describe, expect, it, vi } from 'vitest';

import { getAccount } from './get-account.query';

vi.mock('@model/account');

const mockedGet = vi.mocked(apiGetAccount);

describe('getAccount', () => {
  it('devolve o perfil da sessão', async () => {
    const profile = accountProfileFactory.build();
    mockedGet.mockResolvedValueOnce(profile);

    await expect(getAccount({ cookie: 'auth_token=abc' })).resolves.toEqual(profile);
  });

  it('propaga o 401 quando o cookie é inválido — quem redireciona é o guard', async () => {
    mockedGet.mockRejectedValueOnce(Object.assign(new Error('Unauthorized'), { status: 401 }));
    await expect(getAccount({ cookie: 'auth_token=ruim' })).rejects.toMatchObject({ status: 401 });
  });
});
