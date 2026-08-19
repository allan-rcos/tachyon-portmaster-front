import { accountProfileFactory, roleRefFactory } from '@viewmodel/account/testing/account.factory';
import { pageRequest } from '@viewmodel/core/testing/factory-support';
import { describe, expect, it } from 'vitest';

import { shellIdentity } from './shell';

/** Perfil com nome e papel controlados. */
function account(name: string, role = 'Operação') {
  return accountProfileFactory.build({ name, roles: [roleRefFactory.build({ name: role })] });
}

describe('shellIdentity', () => {
  it('usa a primeira e a ÚLTIMA inicial', () => {
    expect(shellIdentity(account('Ana Luiza Ferreira'), pageRequest()).initials).toBe('AF');
  });

  it('com um nome só, usa uma inicial', () => {
    expect(shellIdentity(account('Ana'), pageRequest()).initials).toBe('A');
  });

  it('tolera espaços em excesso', () => {
    expect(shellIdentity(account('  ana   marés  '), pageRequest()).initials).toBe('AM');
  });

  it('sem perfil vinculado, o papel fica vazio em vez de quebrar', () => {
    const bare = accountProfileFactory.build({ name: 'Ana', roles: [] });
    expect(shellIdentity(bare, pageRequest()).role).toBe('');
  });

  it('leva ao próprio cadastro', () => {
    expect(shellIdentity(account('Ana'), pageRequest()).href).toBe('/painel/conta');
  });

  it('carrega o prefixo de locale no destino', () => {
    expect(shellIdentity(account('Ana'), pageRequest({ locale: 'en' })).href).toBe(
      '/en/painel/conta',
    );
  });
});
