// ============================================================
//  A sincronização de permissões, exercitada SEM DOM. Substitui a metade
//  "permissions" de `RoleForm.island.test.tsx`.
//
//  O que este arquivo protege e a versão em island não protegia: o `PUT` leva o
//  CONJUNTO INTEIRO de permissões, não um delta, e o nome do perfil não viaja.
// ============================================================
import { Permission } from '@model/common';
import { PERMISSION_OPTION_GROUPS } from '@viewmodel/core/i18n/labels';
import { rolePermissionsMessages } from '@viewmodel/roles/i18n/role-permissions-page.messages';
import { updateRolePermissions } from '@viewmodel/roles/mutations/update-role-permissions.mutation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createRolePermissionsVM, type RolePermissionsPageInput } from './role-permissions-page.vm';

vi.mock('@viewmodel/roles/mutations/update-role-permissions.mutation');

const mockedUpdate = vi.mocked(updateRolePermissions);
const t = rolePermissionsMessages('pt-BR');

const input: RolePermissionsPageInput = {
  meta: { title: 'Administrador', description: t.syncPermissions },
  shell: { name: 'Ana', role: 'Administrador', initials: 'AF', href: '/painel/conta' },
  t,
  id: 'rol_1',
  roleName: 'Administrador',
  granted: [Permission.ProductRead],
  permissionGroups: PERMISSION_OPTION_GROUPS,
  listHref: '/painel/perfis',
};

beforeEach(() => {
  mockedUpdate.mockResolvedValue(undefined as never);
});

describe('createRolePermissionsVM', () => {
  it('nasce com as permissões já concedidas marcadas', () => {
    const vm = createRolePermissionsVM(input);

    expect(vm.hasPermission(Permission.ProductRead)).toBe(true);
    expect(vm.hasPermission(Permission.ProductCreate)).toBe(false);
    expect(vm.name()).toBe('Administrador');
  });

  it('sincroniza o conjunto INTEIRO, sem recriar o perfil', async () => {
    const vm = createRolePermissionsVM(input);
    vm.togglePermission(Permission.ProductCreate, true);

    await expect(vm.submit()).resolves.toBe(true);
    expect(mockedUpdate).toHaveBeenCalledWith('rol_1', [
      Permission.ProductRead,
      Permission.ProductCreate,
    ]);
  });

  it('desmarcar tudo é recusado — um perfil sem permissão não serve', async () => {
    const vm = createRolePermissionsVM(input);
    vm.togglePermission(Permission.ProductRead, false);

    await expect(vm.submit()).resolves.toBe(false);
    expect(mockedUpdate).not.toHaveBeenCalled();
    expect(vm.permissionsError()).toBe(t.permissionsRequired);
  });

  it('o nome não é editável neste modo', () => {
    const vm = createRolePermissionsVM(input);
    vm.setName('Outro nome');

    expect(vm.name()).toBe('Administrador');
    expect(vm.nameError()).toBeUndefined();
  });
});
