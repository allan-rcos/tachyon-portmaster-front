import { fireEvent, render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { stubLocation } from '@view/core/testing/stub-location';
import { userEditMessages } from '@viewmodel/users/i18n/user-edit-page.messages';
import { deleteUser } from '@viewmodel/users/mutations/delete-user.mutation';
import { resetUserPassword } from '@viewmodel/users/mutations/reset-user-password.mutation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { UserAdminActions } from './UserAdminActions.island';

vi.mock('@viewmodel/users/mutations/reset-user-password.mutation');
vi.mock('@viewmodel/users/mutations/delete-user.mutation');

const mockedReset = vi.mocked(resetUserPassword);
const mockedDelete = vi.mocked(deleteUser);

const t = userEditMessages('pt-BR');
let loc: ReturnType<typeof stubLocation>;

beforeEach(() => {
  loc = stubLocation();
  mockedReset.mockResolvedValue(undefined);
  mockedDelete.mockResolvedValue(undefined);
});
afterEach(() => loc.restore());

describe('UserAdminActions island', () => {
  it('redefine a senha do usuário e confirma na tela', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <UserAdminActions userId="usr_bruno" t={t} />
    ));

    fireEvent.input(getByLabelText(t.newPassword), { target: { value: 'novasenha' } });
    await user.click(getByRole('button', { name: t.resetPassword }));

    await waitFor(() => expect(mockedReset).toHaveBeenCalledWith('usr_bruno', 'novasenha'));
    await waitFor(() => expect(getByRole('status')).toBeVisible());
  });

  it('só exclui após a confirmação, e então volta para a listagem', async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(() => <UserAdminActions userId="usr_celia" t={t} />);

    await user.click(getByRole('button', { name: t.delete }));
    expect(mockedDelete).not.toHaveBeenCalled();

    expect(getByRole('dialog')).toBeInTheDocument();
    await user.click(getAllByRole('button', { name: t.delete }).at(-1)!);

    await waitFor(() => expect(mockedDelete).toHaveBeenCalledWith('usr_celia'));
    expect(loc.hrefs).toContain('/painel/usuarios');
  });
});
