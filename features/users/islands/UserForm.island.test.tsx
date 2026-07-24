import { render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { UserForm } from './UserForm.island';
import { userFormMessages } from './UserForm.messages';

import { setInput, stubLocation } from '@/test/utils';

const t = userFormMessages('pt-BR');
const roles = [{ id: 'rol_auditor', name: 'Auditor' }];
let loc: ReturnType<typeof stubLocation>;
beforeEach(() => {
  loc = stubLocation();
  document.cookie = 'auth_token=mock_usr_ana; path=/';
});
afterEach(() => loc.restore());

describe('UserForm island', () => {
  it('cria usuário com perfil e redireciona', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <UserForm mode="create" roles={roles} t={t} />
    ));
    setInput(getByLabelText(t.name), 'João Porto');
    setInput(getByLabelText(t.email), 'joao@portmaster.test');
    setInput(getByLabelText(t.initialPassword), 'senha123');
    await user.click(getByLabelText('Auditor'));
    await user.click(getByRole('button', { name: t.create }));
    await waitFor(() => expect(loc.hrefs).toContain('/painel/usuarios'));
  });

  it('bloqueia criação sem perfil', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <UserForm mode="create" roles={roles} t={t} />
    ));
    setInput(getByLabelText(t.name), 'João Porto');
    setInput(getByLabelText(t.email), 'joao@portmaster.test');
    setInput(getByLabelText(t.initialPassword), 'senha123');
    await user.click(getByRole('button', { name: t.create }));
    await waitFor(() => expect(getByRole('alert')).toBeVisible());
    expect(loc.hrefs).not.toContain('/painel/usuarios');
  });
});
