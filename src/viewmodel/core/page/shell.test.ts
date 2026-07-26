import { accountProfileFactory, roleRefFactory } from '@viewmodel/account/testing/account.factory';
import { describe, expect, it } from 'vitest';

import { shellIdentity } from './shell';

/** Perfil com nome e papel controlados. */
function account(name: string, role = 'Operação') {
  return accountProfileFactory.build({ name, roles: [roleRefFactory.build({ name: role })] });
}

describe('shellIdentity', () => {
  it('usa a primeira e a ÚLTIMA inicial', () => {
    expect(shellIdentity(account('Ana Luiza Ferreira')).initials).toBe('AF');
  });

  it('com um nome só, usa uma inicial', () => {
    expect(shellIdentity(account('Ana')).initials).toBe('A');
  });

  it('tolera espaços em excesso', () => {
    expect(shellIdentity(account('  ana   marés  ')).initials).toBe('AM');
  });

  it('sem perfil vinculado, o papel fica vazio em vez de quebrar', () => {
    const bare = accountProfileFactory.build({ name: 'Ana', roles: [] });
    expect(shellIdentity(bare).role).toBe('');
  });

  it('leva ao próprio cadastro', () => {
    expect(shellIdentity(account('Ana')).href).toBe('/painel/conta');
  });
});
