import { fireEvent, render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { stubLocation } from '@view/core/testing/stub-location';
import { userFormMessages } from '@viewmodel/users/i18n/user-form.messages';
import { createUser } from '@viewmodel/users/mutations/create-user.mutation';
import { updateUser } from '@viewmodel/users/mutations/update-user.mutation';
import { userFactory } from '@viewmodel/users/testing/user.factory';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { UserForm } from './UserForm.island';

vi.mock('@viewmodel/users/mutations/create-user.mutation');
vi.mock('@viewmodel/users/mutations/update-user.mutation');

const mockedCreate = vi.mocked(createUser);
const mockedUpdate = vi.mocked(updateUser);

const t = userFormMessages('pt-BR');
const roles = [{ id: 'rol_auditor', name: 'Auditor' }];
let loc: ReturnType<typeof stubLocation>;

beforeEach(() => {
  loc = stubLocation();
  mockedCreate.mockResolvedValue(userFactory.build());
  mockedUpdate.mockResolvedValue(userFactory.build());
});
afterEach(() => loc.restore());

describe('UserForm island', () => {
  it('cria o usuário já vinculado ao perfil marcado', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <UserForm mode="create" roles={roles} t={t} />
    ));

    fireEvent.input(getByLabelText(t.name), { target: { value: 'João Porto' } });
    fireEvent.input(getByLabelText(t.email), { target: { value: 'joao@portmaster.test' } });
    fireEvent.input(getByLabelText(t.initialPassword), { target: { value: 'senha123' } });
    await user.click(getByLabelText('Auditor'));
    await user.click(getByRole('button', { name: t.create }));

    await waitFor(() =>
      expect(mockedCreate).toHaveBeenCalledWith({
        name: 'João Porto',
        email: 'joao@portmaster.test',
        initial_password: 'senha123',
        role_ids: ['rol_auditor'],
      }),
    );
    expect(loc.hrefs).toContain('/painel/usuarios');
  });

  it('exige ao menos um perfil', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <UserForm mode="create" roles={roles} t={t} />
    ));

    fireEvent.input(getByLabelText(t.name), { target: { value: 'João Porto' } });
    fireEvent.input(getByLabelText(t.email), { target: { value: 'joao@portmaster.test' } });
    fireEvent.input(getByLabelText(t.initialPassword), { target: { value: 'senha123' } });
    await user.click(getByRole('button', { name: t.create }));

    await waitFor(() => expect(getByRole('alert')).toBeVisible());
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it('em edição envia dados e perfis numa única chamada ao ViewModel', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <UserForm
        mode="edit"
        userId="usr_bruno"
        roles={roles}
        defaultValues={{
          name: 'Bruno',
          email: 'bruno@portmaster.test',
          role_ids: ['rol_auditor'],
        }}
        t={t}
      />
    ));

    fireEvent.input(getByLabelText(t.name), { target: { value: 'Bruno Pátio' } });
    await user.click(getByRole('button', { name: t.save }));

    await waitFor(() =>
      expect(mockedUpdate).toHaveBeenCalledWith('usr_bruno', {
        name: 'Bruno Pátio',
        email: 'bruno@portmaster.test',
        role_ids: ['rol_auditor'],
      }),
    );
  });
});
