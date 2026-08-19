// ============================================================
//  A edição de usuário e as ações administrativas, exercitadas SEM DOM.
//  Substituem `UserForm.island.test.tsx` (metade "edit") e
//  `UserAdminActions.island.test.tsx`.
// ============================================================
import { userEditMessages } from '@viewmodel/users/i18n/user-edit-page.messages';
import { deleteUser } from '@viewmodel/users/mutations/delete-user.mutation';
import { resetUserPassword } from '@viewmodel/users/mutations/reset-user-password.mutation';
import { updateUser } from '@viewmodel/users/mutations/update-user.mutation';
import { userListPageInput } from '@viewmodel/users/testing/user.factory';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createUserEditVM, type UserEditPageInput } from './user-edit-page.vm';

vi.mock('@viewmodel/users/mutations/update-user.mutation');
vi.mock('@viewmodel/users/mutations/delete-user.mutation');
vi.mock('@viewmodel/users/mutations/reset-user-password.mutation');

const mockedUpdate = vi.mocked(updateUser);
const mockedDelete = vi.mocked(deleteUser);
const mockedReset = vi.mocked(resetUserPassword);
const t = userEditMessages('pt-BR');

const input: UserEditPageInput = {
  meta: { title: `${t.edit} — Ana Marés`, description: t.subtitle },
  shell: { name: 'Ana', role: 'Administrador', initials: 'AF', href: '/painel/conta' },
  t,
  id: 'usr_1',
  userName: 'Ana Marés',
  values: { name: 'Ana Marés', email: 'ana@x.com', roleIds: ['rol_admin'] },
  roles: [
    { id: 'rol_admin', name: 'Administrador' },
    { id: 'rol_op', name: 'Operador' },
  ],
  listHref: '/painel/usuarios',
  background: userListPageInput(),
};

beforeEach(() => {
  mockedUpdate.mockResolvedValue(undefined as never);
  mockedDelete.mockResolvedValue(undefined);
  mockedReset.mockResolvedValue(undefined);
});

describe('createUserEditVM — formulário', () => {
  it('nasce preenchido, com os perfis já vinculados marcados', () => {
    const vm = createUserEditVM(input);

    expect(vm.value('name')).toBe('Ana Marés');
    expect(vm.value('email')).toBe('ana@x.com');
    expect(vm.hasRole('rol_admin')).toBe(true);
    expect(vm.hasRole('rol_op')).toBe(false);
  });

  it('envia dados e perfis numa única chamada, SEM a senha', async () => {
    const vm = createUserEditVM(input);
    vm.set('name', 'Ana M. Marés');
    vm.toggleRole('rol_op', true);

    await expect(vm.submit()).resolves.toBe(true);
    expect(mockedUpdate).toHaveBeenCalledWith('usr_1', {
      name: 'Ana M. Marés',
      email: 'ana@x.com',
      role_ids: ['rol_admin', 'rol_op'],
    });
  });

  it('não deixa ficar sem perfil nenhum', async () => {
    const vm = createUserEditVM(input);
    vm.toggleRole('rol_admin', false);

    await expect(vm.submit()).resolves.toBe(false);
    expect(mockedUpdate).not.toHaveBeenCalled();
    expect(vm.rolesError()).toBe(t.rolesRequired);
  });
});

describe('createUserEditVM — ações administrativas', () => {
  it('redefine a senha, limpa o campo e acende a confirmação', async () => {
    const vm = createUserEditVM(input);
    vm.setNewPassword('nova-senha');

    await expect(vm.resetPassword()).resolves.toBe(true);
    expect(mockedReset).toHaveBeenCalledWith('usr_1', 'nova-senha');
    expect(vm.newPassword()).toBe('');
    expect(vm.resetDone()).toBe(true);
    expect(vm.newPasswordError()).toBeUndefined();
  });

  it('recusa senha curta e não chama a API', async () => {
    const vm = createUserEditVM(input);
    vm.setNewPassword('123');

    await expect(vm.resetPassword()).resolves.toBe(false);
    expect(mockedReset).not.toHaveBeenCalled();
    expect(vm.newPasswordError()).toBe(t.passwordMin);
  });

  it('digitar de novo apaga a confirmação anterior', async () => {
    const vm = createUserEditVM(input);
    vm.setNewPassword('nova-senha');
    await vm.resetPassword();
    expect(vm.resetDone()).toBe(true);

    vm.setNewPassword('o');
    expect(vm.resetDone()).toBe(false);
  });

  it('remove() exclui pelo id e REJEITA na falha', async () => {
    const vm = createUserEditVM(input);

    await expect(vm.remove()).resolves.toBeUndefined();
    expect(mockedDelete).toHaveBeenCalledWith('usr_1');

    mockedDelete.mockRejectedValueOnce(new Error('409'));
    await expect(vm.remove()).rejects.toThrow('409');
  });
});
