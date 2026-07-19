import { render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { PermissionMatrix } from './PermissionMatrix';
import { RoleForm } from './RoleForm.island';

import type { Permission } from '@/services/gen/flow/v1/common';
import ptBR from '@/shared/i18n/messages/pt-BR';
import { setInput, stubLocation } from '@/test/utils';

const t = { ...ptBR.common, ...ptBR.roles };
let loc: ReturnType<typeof stubLocation>;
beforeEach(() => {
  loc = stubLocation();
  document.cookie = 'auth_token=mock_usr_ana; path=/';
});
afterEach(() => loc.restore());

describe('PermissionMatrix', () => {
  it('reflete seleção e dispara toggle', async () => {
    const user = userEvent.setup();
    let toggled: [Permission, boolean] | undefined;
    const { getByLabelText } = render(() => (
      <PermissionMatrix
        selected={new Set<Permission>(['ProductRead'])}
        onToggle={(p, c) => (toggled = [p, c])}
      />
    ));
    expect(getByLabelText('Ver produtos')).toBeChecked();
    await user.click(getByLabelText('Criar produtos'));
    expect(toggled).toEqual(['ProductCreate', true]);
  });
});

describe('RoleForm island', () => {
  it('cria perfil com nome e ao menos uma permissão', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => <RoleForm mode="create" t={t} />);
    setInput(getByLabelText(t.name), 'Conferente');
    await user.click(getByLabelText('Ver contêineres'));
    await user.click(getByRole('button', { name: t.create }));
    await waitFor(() => expect(loc.hrefs).toContain('/painel/perfis'));
  });

  it('bloqueia criação sem permissões', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => <RoleForm mode="create" t={t} />);
    setInput(getByLabelText(t.name), 'Vazio');
    await user.click(getByRole('button', { name: t.create }));
    await waitFor(() => expect(getByRole('alert')).toBeVisible());
    expect(loc.hrefs).not.toContain('/painel/perfis');
  });

  it('sincroniza permissões de perfil existente', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <RoleForm
        mode="permissions"
        roleId="rol_auditor"
        defaultName="Auditor"
        defaultPermissions={['MetricsRead']}
        t={t}
      />
    ));
    await user.click(getByLabelText('Ver contêineres'));
    await user.click(getByRole('button', { name: t.save }));
    await waitFor(() => expect(loc.hrefs).toContain('/painel/perfis'));
  });
});
