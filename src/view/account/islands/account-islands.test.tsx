import { render, waitFor } from '@solidjs/testing-library';
import { setInput, stubLocation } from '@testing/dom';
import { accountProfileFactory } from '@testing/factories/model.factory';
import userEvent from '@testing-library/user-event';
import { accountMessages } from '@viewmodel/account/i18n/account-page.messages';
import { changeAccountPassword } from '@viewmodel/account/mutations/change-account-password.mutation';
import { updateAccountProfile } from '@viewmodel/account/mutations/update-account-profile.mutation';
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

    setInput(getByLabelText(t.name), 'Ana M. Marés');
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

    setInput(getByLabelText(t.currentPassword), 'admin123');
    setInput(getByLabelText(t.newPassword), 'novasenha');
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

    setInput(getByLabelText(t.currentPassword), 'errada');
    setInput(getByLabelText(t.newPassword), 'novasenha');
    await user.click(getByRole('button', { name: t.changePassword }));

    await waitFor(() => expect(getByRole('alert')).toBeVisible());
  });
});
