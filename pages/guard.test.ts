import type { AccountProfile } from 'tachyon-portmaster-sdk/account';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mocka só o loadAccount (fetch da sessão); mantém hasPermissions real para
// exercitar a decisão de autorização de ponta a ponta.
vi.mock('@/features/core/auth/session', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/core/auth/session')>();
  return { ...actual, loadAccount: vi.fn() };
});

import { guard } from './+guard';

import { loadAccount } from '@/features/core/auth/session';

const mockedLoadAccount = vi.mocked(loadAccount);

function account(permissions: string[]): AccountProfile {
  return {
    id: '1',
    name: 'Ana',
    email: 'ana@portmaster.test',
    roles: [{ id: 'r1', name: 'Op', user_count: 1, permissions: permissions as never }],
  };
}

// pageContext mínimo que o guard consome.
function ctx(urlPathname: string, permissions?: string[]) {
  return {
    urlPathname,
    headers: { cookie: 'auth_token=x' },
    config: permissions === undefined ? {} : { permissions },
  } as never;
}

beforeEach(() => mockedLoadAccount.mockReset());

describe('guard (auth + permissões)', () => {
  it('libera rota pública sem tocar na sessão', async () => {
    await expect(guard(ctx('/entrar'))).resolves.toBeUndefined();
    expect(mockedLoadAccount).not.toHaveBeenCalled();
  });

  it('redireciona ao login quando não há sessão válida (401)', async () => {
    mockedLoadAccount.mockRejectedValueOnce(new Error('401'));
    await expect(guard(ctx('/painel/conteineres', ['ContainerRead']))).rejects.toMatchObject({
      _pageContextAbort: { _urlRedirect: { url: expect.stringContaining('/entrar') } },
    });
  });

  it('emite 403 quando falta permissão exigida', async () => {
    mockedLoadAccount.mockResolvedValueOnce(account(['ContainerRead']));
    await expect(guard(ctx('/painel/conteineres/nova', ['ContainerCreate']))).rejects.toMatchObject(
      {
        _pageContextAbort: { abortStatusCode: 403 },
      },
    );
  });

  it('libera quando o usuário tem todas as permissões exigidas', async () => {
    mockedLoadAccount.mockResolvedValueOnce(account(['ContainerRead', 'ContainerCreate']));
    await expect(
      guard(ctx('/painel/conteineres/nova', ['ContainerCreate'])),
    ).resolves.toBeUndefined();
  });

  it('libera rota autenticada sem permissões declaradas (só auth)', async () => {
    mockedLoadAccount.mockResolvedValueOnce(account([]));
    await expect(guard(ctx('/painel/conta', []))).resolves.toBeUndefined();
  });
});
