import { fireEvent, render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { stubLocation } from '@view/core/testing/stub-location';
import { PermissionMatrix } from '@view/roles/components/PermissionMatrix';
import { PERMISSION_OPTION_GROUPS } from '@viewmodel/core/i18n/labels';
import { roleFormMessages } from '@viewmodel/roles/i18n/role-form.messages';
import { createRole } from '@viewmodel/roles/mutations/create-role.mutation';
import { updateRolePermissions } from '@viewmodel/roles/mutations/update-role-permissions.mutation';
import { roleFactory } from '@viewmodel/roles/testing/role.factory';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RoleForm } from './RoleForm.island';

vi.mock('@viewmodel/roles/mutations/create-role.mutation');
vi.mock('@viewmodel/roles/mutations/update-role-permissions.mutation');

const mockedCreate = vi.mocked(createRole);
const mockedUpdate = vi.mocked(updateRolePermissions);

const t = roleFormMessages('pt-BR');
let loc: ReturnType<typeof stubLocation>;

beforeEach(() => {
  loc = stubLocation();
  mockedCreate.mockResolvedValue(roleFactory.build());
  mockedUpdate.mockResolvedValue(roleFactory.build());
});
afterEach(() => loc.restore());

describe('PermissionMatrix', () => {
  it('reflete a seleção atual e emite o toggle', async () => {
    const user = userEvent.setup();
    let toggled: [string, boolean] | undefined;
    const { getByLabelText } = render(() => (
      <PermissionMatrix
        groups={PERMISSION_OPTION_GROUPS}
        selected={new Set(['ProductRead'])}
        onToggle={(p, c) => (toggled = [p, c])}
      />
    ));

    expect(getByLabelText('Ver produtos')).toBeChecked();
    await user.click(getByLabelText('Criar produtos'));
    expect(toggled).toEqual(['ProductCreate', true]);
  });
});

describe('RoleForm island', () => {
  it('cria o perfil com nome e permissões marcadas', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <RoleForm mode="create" t={t} permissionGroups={PERMISSION_OPTION_GROUPS} />
    ));

    fireEvent.input(getByLabelText(t.name), { target: { value: 'Conferente' } });
    await user.click(getByLabelText('Ver contêineres'));
    await user.click(getByRole('button', { name: t.create }));

    await waitFor(() =>
      expect(mockedCreate).toHaveBeenCalledWith({
        name: 'Conferente',
        permissions: ['ContainerRead'],
      }),
    );
    expect(loc.hrefs).toContain('/painel/perfis');
  });

  it('exige ao menos uma permissão', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <RoleForm mode="create" t={t} permissionGroups={PERMISSION_OPTION_GROUPS} />
    ));

    fireEvent.input(getByLabelText(t.name), { target: { value: 'Vazio' } });
    await user.click(getByRole('button', { name: t.create }));

    await waitFor(() => expect(getByRole('alert')).toBeVisible());
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it('em modo permissões sincroniza o conjunto inteiro, sem recriar o perfil', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <RoleForm
        mode="permissions"
        roleId="rol_auditor"
        defaultName="Auditor"
        defaultPermissions={['MetricsRead']}
        t={t}
        permissionGroups={PERMISSION_OPTION_GROUPS}
      />
    ));

    await user.click(getByLabelText('Ver contêineres'));
    await user.click(getByRole('button', { name: t.save }));

    await waitFor(() =>
      expect(mockedUpdate).toHaveBeenCalledWith('rol_auditor', ['MetricsRead', 'ContainerRead']),
    );
    expect(mockedCreate).not.toHaveBeenCalled();
  });
});
