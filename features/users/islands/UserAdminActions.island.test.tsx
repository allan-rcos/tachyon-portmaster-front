import { render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { UserAdminActions } from './UserAdminActions.island';

import { userEditMessages } from '@/pages/painel/usuarios/@id/editar/messages';
import { setInput, stubLocation } from '@/test/utils';

const t = userEditMessages('pt-BR');
let loc: ReturnType<typeof stubLocation>;
beforeEach(() => {
  loc = stubLocation();
  document.cookie = 'auth_token=mock_usr_ana; path=/';
});
afterEach(() => loc.restore());

describe('UserAdminActions island', () => {
  it('redefine a senha e mostra confirmação', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <UserAdminActions userId="usr_bruno" t={t} />
    ));
    setInput(getByLabelText(t.newPassword), 'novasenha');
    await user.click(getByRole('button', { name: t.resetPassword }));
    await waitFor(() => expect(getByRole('status')).toBeVisible());
  });

  it('exclui o usuário após confirmação', async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(() => <UserAdminActions userId="usr_celia" t={t} />);
    await user.click(getByRole('button', { name: t.delete }));
    expect(getByRole('dialog')).toBeInTheDocument();
    await user.click(getAllByRole('button', { name: t.delete }).at(-1)!);
    await waitFor(() => expect(loc.hrefs).toContain('/painel/usuarios'));
  });
});
