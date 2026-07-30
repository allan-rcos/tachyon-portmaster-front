// ============================================================
//  A criação de perfil, exercitada SEM DOM. Substitui parte de
//  `RoleForm.island.test.tsx`.
//
//  Ver `@viewmodel/products/product-create-page.vm.test` para o modelo.
// ============================================================
import { Permission } from '@model/common';
import { PERMISSION_OPTION_GROUPS } from '@viewmodel/core/i18n/labels';
import { roleNewMessages } from '@viewmodel/roles/i18n/role-create-page.messages';
import { createRole } from '@viewmodel/roles/mutations/create-role.mutation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createRoleCreateVM, type RoleCreatePageInput } from './role-create-page.vm';

vi.mock('@viewmodel/roles/mutations/create-role.mutation');

const mockedCreate = vi.mocked(createRole);
const t = roleNewMessages('pt-BR');

const input: RoleCreatePageInput = {
  meta: { title: t.new, description: t.subtitle },
  shell: { name: 'Ana', role: 'Administrador', initials: 'AF', href: '/painel/conta' },
  t,
  listHref: '/painel/perfis',
  permissionGroups: PERMISSION_OPTION_GROUPS,
};

beforeEach(() => {
  mockedCreate.mockResolvedValue(undefined as never);
});

describe('createRoleCreateVM', () => {
  it('cria o perfil com nome e permissões marcadas', async () => {
    const vm = createRoleCreateVM(input);
    vm.setName('Operador de pátio');
    vm.togglePermission(Permission.ProductRead, true);

    await expect(vm.submit()).resolves.toBe(true);
    expect(mockedCreate).toHaveBeenCalledWith({
      name: 'Operador de pátio',
      permissions: [Permission.ProductRead],
    });
  });

  it('exige ao menos uma permissão', async () => {
    const vm = createRoleCreateVM(input);
    vm.setName('Operador de pátio');

    await expect(vm.submit()).resolves.toBe(false);
    expect(mockedCreate).not.toHaveBeenCalled();
    expect(vm.permissionsError()).toBe(t.permissionsRequired);
  });

  it('reflete a seleção e o toggle desmarca', () => {
    const vm = createRoleCreateVM(input);
    expect(vm.hasPermission(Permission.ProductRead)).toBe(false);

    vm.togglePermission(Permission.ProductRead, true);
    expect(vm.hasPermission(Permission.ProductRead)).toBe(true);

    vm.togglePermission(Permission.ProductRead, false);
    expect(vm.hasPermission(Permission.ProductRead)).toBe(false);
  });

  it('o erro da matriz só aparece depois da primeira tentativa', async () => {
    const vm = createRoleCreateVM(input);
    expect(vm.permissionsError()).toBeUndefined();

    await vm.submit();
    expect(vm.permissionsError()).toBe(t.permissionsRequired);
  });

  it('o erro do nome só aparece depois do blur', () => {
    const vm = createRoleCreateVM(input);
    vm.setName('x');

    expect(vm.nameError()).toBeUndefined();
    vm.blurName();
    expect(vm.nameError()).toBe(t.nameShort);
  });

  it('falha da API vira estado, não exceção', async () => {
    mockedCreate.mockRejectedValueOnce(new Error('409'));
    const vm = createRoleCreateVM(input);
    vm.setName('Operador de pátio');
    vm.togglePermission(Permission.ProductRead, true);

    await expect(vm.submit()).resolves.toBe(false);
    expect(vm.failed()).toBe(true);
  });
});
