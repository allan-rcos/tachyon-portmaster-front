import { fireEvent, render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { stubLocation } from '@view/core/testing/stub-location';
import { accountMessages } from '@viewmodel/account/i18n/account-page.messages';
import { changeAccountPassword } from '@viewmodel/account/mutations/change-account-password.mutation';
import { updateAccountProfile } from '@viewmodel/account/mutations/update-account-profile.mutation';
import { accountProfileFactory } from '@viewmodel/account/testing/account.factory';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AccountForm } from './AccountForm.island';
import { PasswordChange } from './PasswordChange.island';

vi.mock('@viewmodel/account/mutations/update-account-profile.mutation');
vi.mock('@viewmodel/account/mutations/change-account-password.mutation');

const mockedUpdate = vi.mocked(updateAccountProfile);
const mockedChange = vi.mocked(changeAccountPassword);

const t = accountMessages('pt-BR');
let loc: ReturnType<typeof stubLocation>;

beforeEach(() => {
  loc = stubLocation();
  mockedUpdate.mockResolvedValue(accountProfileFactory.build());
  mockedChange.mockResolvedValue(null);
});
afterEach(() => loc.restore());

describe('AccountForm island', () => {
  it('atualiza nome e e-mail e recarrega para refletir na tela toda', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <AccountForm name="Ana Marés" email="ana@portmaster.test" t={t} />
    ));

    fireEvent.input(getByLabelText(t.name), { target: { value: 'Ana M. Marés' } });
    await user.click(getByRole('button', { name: t.save }));

    await waitFor(() =>
      expect(mockedUpdate).toHaveBeenCalledWith({
        name: 'Ana M. Marés',
        email: 'ana@portmaster.test',
      }),
    );
    await waitFor(() => expect(loc.reloads()).toBeGreaterThan(0));
  });
});

describe('PasswordChange island', () => {
  it('envia a troca e confirma o sucesso na tela', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => <PasswordChange t={t} />);

    fireEvent.input(getByLabelText(t.currentPassword), { target: { value: 'admin123' } });
    fireEvent.input(getByLabelText(t.newPassword), { target: { value: 'novasenha' } });
    await user.click(getByRole('button', { name: t.changePassword }));

    await waitFor(() =>
      expect(mockedChange).toHaveBeenCalledWith({
        current_password: 'admin123',
        new_password: 'novasenha',
      }),
    );
    await waitFor(() => expect(getByRole('status')).toBeVisible());
  });

  it('mostra erro quando a API recusa a senha atual', async () => {
    mockedChange.mockRejectedValueOnce(Object.assign(new Error('422'), { status: 422 }));
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => <PasswordChange t={t} />);

    fireEvent.input(getByLabelText(t.currentPassword), { target: { value: 'errada' } });
    fireEvent.input(getByLabelText(t.newPassword), { target: { value: 'novasenha' } });
    await user.click(getByRole('button', { name: t.changePassword }));

    await waitFor(() => expect(getByRole('alert')).toBeVisible());
  });
});
