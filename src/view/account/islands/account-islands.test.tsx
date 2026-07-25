import { render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { accountMessages } from '@viewmodel/account/i18n/account-page.messages';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { AccountForm } from './AccountForm.island';
import { PasswordChange } from './PasswordChange.island';

import { setInput, stubLocation } from '@/test/utils';

const t = accountMessages('pt-BR');
let loc: ReturnType<typeof stubLocation>;
beforeEach(() => {
  loc = stubLocation();
  document.cookie = 'auth_token=mock_usr_ana; path=/';
});
afterEach(() => loc.restore());

describe('AccountForm island', () => {
  it('atualiza dados e recarrega', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <AccountForm name="Ana Marés" email="ana@portmaster.test" t={t} />
    ));
    setInput(getByLabelText(t.name), 'Ana M. Marés');
    await user.click(getByRole('button', { name: t.save }));
    await waitFor(() => expect(loc.reloads()).toBeGreaterThan(0));
  });
});

describe('PasswordChange island', () => {
  it('troca a senha com a senha atual correta', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => <PasswordChange t={t} />);
    setInput(getByLabelText(t.currentPassword), 'admin123');
    setInput(getByLabelText(t.newPassword), 'novasenha');
    await user.click(getByRole('button', { name: t.changePassword }));
    await waitFor(() => expect(getByRole('status')).toBeVisible());
  });

  it('mostra erro quando a senha atual está incorreta', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => <PasswordChange t={t} />);
    setInput(getByLabelText(t.currentPassword), 'errada');
    setInput(getByLabelText(t.newPassword), 'novasenha');
    await user.click(getByRole('button', { name: t.changePassword }));
    await waitFor(() => expect(getByRole('alert')).toBeVisible());
  });
});
