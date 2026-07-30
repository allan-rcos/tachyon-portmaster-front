// ============================================================
//  Os dois formulários da conta, exercitados SEM DOM. Substituem
//  `account-islands.test.tsx`, que montava as duas islands em jsdom.
//
//  Ver `@viewmodel/products/product-create-page.vm.test` para o modelo.
// ============================================================
import { accountMessages } from '@viewmodel/account/i18n/account-page.messages';
import { changeAccountPassword } from '@viewmodel/account/mutations/change-account-password.mutation';
import { updateAccountProfile } from '@viewmodel/account/mutations/update-account-profile.mutation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createAccountPageVM, type AccountPageInput } from './account-page.vm';

vi.mock('@viewmodel/account/mutations/update-account-profile.mutation');
vi.mock('@viewmodel/account/mutations/change-account-password.mutation');

const mockedProfile = vi.mocked(updateAccountProfile);
const mockedPassword = vi.mocked(changeAccountPassword);

const { permissionsCount, ...t } = accountMessages('pt-BR');
void permissionsCount;

const input: AccountPageInput = {
  meta: { title: t.title, description: t.subtitle },
  shell: { name: 'Allan Costa', role: 'Administrador', initials: 'AC', href: '/painel/conta' },
  t,
  identity: { name: 'Allan Costa', email: 'allan@portmaster.test' },
  roles: [{ id: 'rol_1', name: 'Administrador', permissionsLabel: '12 permissões' }],
};

beforeEach(() => {
  mockedProfile.mockResolvedValue(undefined as never);
  mockedPassword.mockResolvedValue(undefined as never);
});

describe('createAccountPageVM — dados da conta', () => {
  it('nasce preenchido com a identidade autenticada', () => {
    const vm = createAccountPageVM(input);

    expect(vm.profileValue('name')).toBe('Allan Costa');
    expect(vm.profileValue('email')).toBe('allan@portmaster.test');
  });

  it('grava nome e e-mail', async () => {
    const vm = createAccountPageVM(input);
    vm.setProfile('name', 'Állan R. Costa');

    await expect(vm.saveProfile()).resolves.toBe(true);
    expect(mockedProfile).toHaveBeenCalledWith({
      name: 'Állan R. Costa',
      email: 'allan@portmaster.test',
    });
  });

  it('recusa e-mail inválido e revela o erro', async () => {
    const vm = createAccountPageVM(input);
    vm.setProfile('email', 'nao-e-email');

    await expect(vm.saveProfile()).resolves.toBe(false);
    expect(mockedProfile).not.toHaveBeenCalled();
    expect(vm.profileError('email')).toBe(t.emailInvalid);
  });

  it('falha da API vira estado, não exceção', async () => {
    mockedProfile.mockRejectedValueOnce(new Error('409'));
    const vm = createAccountPageVM(input);

    await expect(vm.saveProfile()).resolves.toBe(false);
    expect(vm.profileFailed()).toBe(true);
    expect(vm.savingProfile()).toBe(false);
  });
});

describe('createAccountPageVM — troca de senha', () => {
  it('envia as duas senhas, limpa os campos e confirma', async () => {
    const vm = createAccountPageVM(input);
    vm.setPassword('current_password', 'antiga123');
    vm.setPassword('new_password', 'nova12345');

    await expect(vm.changePassword()).resolves.toBe(true);
    expect(mockedPassword).toHaveBeenCalledWith({
      current_password: 'antiga123',
      new_password: 'nova12345',
    });
    expect(vm.passwordValue('current_password')).toBe('');
    expect(vm.passwordValue('new_password')).toBe('');
    expect(vm.passwordChanged()).toBe(true);
  });

  it('recusa senha nova curta sem chamar a API', async () => {
    const vm = createAccountPageVM(input);
    vm.setPassword('current_password', 'antiga123');
    vm.setPassword('new_password', '123');

    await expect(vm.changePassword()).resolves.toBe(false);
    expect(mockedPassword).not.toHaveBeenCalled();
    expect(vm.passwordError('new_password')).toBe(t.passwordMin);
  });

  it('mostra erro quando a API recusa a senha atual', async () => {
    mockedPassword.mockRejectedValueOnce(new Error('401'));
    const vm = createAccountPageVM(input);
    vm.setPassword('current_password', 'errada');
    vm.setPassword('new_password', 'nova12345');

    await expect(vm.changePassword()).resolves.toBe(false);
    expect(vm.passwordFailed()).toBe(true);
    expect(vm.passwordChanged()).toBe(false);
  });

  it('digitar de novo apaga a confirmação anterior', async () => {
    const vm = createAccountPageVM(input);
    vm.setPassword('current_password', 'antiga123');
    vm.setPassword('new_password', 'nova12345');
    await vm.changePassword();
    expect(vm.passwordChanged()).toBe(true);

    vm.setPassword('new_password', 'o');
    expect(vm.passwordChanged()).toBe(false);
  });

  it('os dois formulários são independentes', async () => {
    const vm = createAccountPageVM(input);
    vm.setPassword('new_password', '123');
    await vm.changePassword();
    expect(vm.passwordFailed()).toBe(false);
    expect(vm.passwordError('new_password')).toBe(t.passwordMin);

    // O erro da senha não contamina o formulário de dados.
    expect(vm.profileError('name')).toBeUndefined();
    await expect(vm.saveProfile()).resolves.toBe(true);
  });
});
