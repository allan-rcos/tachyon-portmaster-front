import { getAccount } from '@model/account';
import { accountProfileFactory, roleRefFactory } from '@viewmodel/account/testing/account.factory';
import * as client from '@viewmodel/core/client/api-client';
import type { PageRequest } from '@viewmodel/core/page/page-request';
import { pageRequest } from '@viewmodel/core/testing/factory-support';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { grantedPermissions, hasPermissions, loadAccount } from './session';

vi.mock('@model/account');

const mockedGet = vi.mocked(getAccount);

/** Requisição mínima; `headers` é o que separa servidor de navegador. */
function request(headers: PageRequest['headers']): PageRequest {
  return pageRequest({ headers });
}

beforeEach(() => {
  vi.restoreAllMocks();
  mockedGet.mockResolvedValue(accountProfileFactory.build());
});

describe('loadAccount — de que lado a chamada sai', () => {
  it('no NAVEGADOR (sem headers) usa o client de navegador, não o de servidor', async () => {
    const resolve = vi.spyOn(client, 'resolveClient');
    const server = vi.spyOn(client, 'serverClient');

    await loadAccount(request(undefined));

    expect(resolve).toHaveBeenCalledWith(undefined);
    expect(server).not.toHaveBeenCalled();
  });

  it('no SERVIDOR passa os headers adiante, para o cookie da requisição viajar', async () => {
    const resolve = vi.spyOn(client, 'resolveClient');
    const headers = { cookie: 'auth_token=abc' };

    await loadAccount(request(headers));

    expect(resolve).toHaveBeenCalledWith(headers);
  });
});

describe('loadAccount — memoização', () => {
  it('memoiza por requisição: um fetch só, ainda que várias rotas peçam', async () => {
    const req = request({ cookie: 'auth_token=abc' });

    await Promise.all([loadAccount(req), loadAccount(req)]);
    await loadAccount(req);

    expect(mockedGet).toHaveBeenCalledTimes(1);
  });

  it('não memoiza entre requisições diferentes', async () => {
    await loadAccount(request({ cookie: 'auth_token=a' }));
    await loadAccount(request({ cookie: 'auth_token=b' }));

    expect(mockedGet).toHaveBeenCalledTimes(2);
  });

  it('sem headers não há chave de memoização — cada chamada busca', async () => {
    await loadAccount(request(undefined));
    await loadAccount(request(undefined));

    expect(mockedGet).toHaveBeenCalledTimes(2);
  });
});

describe('permissões', () => {
  it('une as permissões de todos os perfis', () => {
    const account = accountProfileFactory.build({
      roles: [
        roleRefFactory.build({ permissions: ['product:read'] }),
        roleRefFactory.build({ permissions: ['product:create', 'product:read'] }),
      ],
    });
    expect(grantedPermissions(account)).toEqual(new Set(['product:read', 'product:create']));
  });

  it('exige TODAS as permissões pedidas', () => {
    const account = accountProfileFactory.build({
      roles: [roleRefFactory.build({ permissions: ['product:read'] })],
    });
    expect(hasPermissions(account, ['product:read'])).toBe(true);
    expect(hasPermissions(account, ['product:read', 'product:create'])).toBe(false);
  });

  it('lista vazia significa "só exige sessão"', () => {
    const account = accountProfileFactory.build({ roles: [] });
    expect(hasPermissions(account, [])).toBe(true);
  });
});
