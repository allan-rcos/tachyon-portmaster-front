// ============================================================
//  A criação de usuário, exercitada SEM DOM. Substitui parte de
//  `UserForm.island.test.tsx`.
//
//  Ver `@viewmodel/products/product-create-page.vm.test` para o modelo.
// ============================================================
import { userNewMessages } from '@viewmodel/users/i18n/user-create-page.messages';
import { createUser } from '@viewmodel/users/mutations/create-user.mutation';
import { userListPageInput } from '@viewmodel/users/testing/user.factory';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createUserCreateVM, type UserCreatePageInput } from './user-create-page.vm';

vi.mock('@viewmodel/users/mutations/create-user.mutation');

const mockedCreate = vi.mocked(createUser);
const t = userNewMessages('pt-BR');

const input: UserCreatePageInput = {
  meta: { title: t.new, description: t.subtitle },
  shell: { name: 'Ana', role: 'Administrador', initials: 'AF', href: '/painel/conta' },
  t,
  roles: [
    { id: 'rol_admin', name: 'Administrador' },
    { id: 'rol_op', name: 'Operador' },
  ],
  listHref: '/painel/usuarios',
  background: userListPageInput(),
};

beforeEach(() => {
  mockedCreate.mockResolvedValue(undefined as never);
});

/** Preenche os campos obrigatórios de texto. */
function fill(vm: ReturnType<typeof createUserCreateVM>) {
  vm.set('name', 'Ana Marés');
  vm.set('email', 'ana@x.com');
  vm.set('initial_password', 'segura123');
}

describe('createUserCreateVM', () => {
  it('cria o usuário já vinculado aos perfis marcados', async () => {
    const vm = createUserCreateVM(input);
    fill(vm);
    vm.toggleRole('rol_admin', true);

    await expect(vm.submit()).resolves.toBe(true);
    expect(mockedCreate).toHaveBeenCalledWith({
      name: 'Ana Marés',
      email: 'ana@x.com',
      initial_password: 'segura123',
      role_ids: ['rol_admin'],
    });
  });

  it('exige ao menos um perfil', async () => {
    const vm = createUserCreateVM(input);
    fill(vm);

    await expect(vm.submit()).resolves.toBe(false);
    expect(mockedCreate).not.toHaveBeenCalled();
    expect(vm.rolesError()).toBe(t.rolesRequired);
  });

  it('desmarcar remove o vínculo', () => {
    const vm = createUserCreateVM(input);
    vm.toggleRole('rol_admin', true);
    vm.toggleRole('rol_op', true);
    expect(vm.hasRole('rol_admin')).toBe(true);

    vm.toggleRole('rol_admin', false);
    expect(vm.hasRole('rol_admin')).toBe(false);
    expect(vm.hasRole('rol_op')).toBe(true);
  });

  it('o erro de perfis só aparece depois da primeira tentativa', async () => {
    const vm = createUserCreateVM(input);
    expect(vm.rolesError()).toBeUndefined();

    await vm.submit();
    expect(vm.rolesError()).toBe(t.rolesRequired);
  });

  it('recusa e-mail inválido e senha curta', async () => {
    const vm = createUserCreateVM(input);
    vm.set('name', 'Ana Marés');
    vm.set('email', 'nao-e-email');
    vm.set('initial_password', '123');
    vm.toggleRole('rol_admin', true);

    await expect(vm.submit()).resolves.toBe(false);
    expect(vm.error('email')).toBe(t.emailInvalid);
    expect(vm.error('initial_password')).toBe(t.passwordMin);
  });

  it('falha da API vira estado, não exceção', async () => {
    mockedCreate.mockRejectedValueOnce(new Error('409'));
    const vm = createUserCreateVM(input);
    fill(vm);
    vm.toggleRole('rol_admin', true);

    await expect(vm.submit()).resolves.toBe(false);
    expect(vm.failed()).toBe(true);
  });
});
