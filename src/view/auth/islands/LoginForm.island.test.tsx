// ============================================================
//  O island é View: sua responsabilidade é coletar entrada, validar e chamar
//  o ViewModel. Por isso o teste mocka a mutação e verifica a CHAMADA — não
//  sobe uma API falsa para conferir o que o backend faria com ela.
// ============================================================
import { render, waitFor } from '@solidjs/testing-library';
import { setInput, stubLocation } from '@testing/dom';
import userEvent from '@testing-library/user-event';
import { loginMessages } from '@viewmodel/auth/i18n/login-page.messages';
import { signIn } from '@viewmodel/auth/mutations/sign-in.mutation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginForm } from './LoginForm.island';

vi.mock('@viewmodel/auth/mutations/sign-in.mutation');

const mockedSignIn = vi.mocked(signIn);
const t = loginMessages('pt-BR');

let loc: ReturnType<typeof stubLocation>;
beforeEach(() => {
  loc = stubLocation();
  mockedSignIn.mockResolvedValue(undefined);
});
afterEach(() => loc.restore());

describe('LoginForm', () => {
  it('envia as credenciais ao ViewModel e navega para o painel', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => <LoginForm t={t} />);

    setInput(getByLabelText(t.email), 'ana@portmaster.test');
    setInput(getByLabelText(t.password), 'admin123');
    await user.click(getByRole('button', { name: t.submit }));

    await waitFor(() =>
      expect(mockedSignIn).toHaveBeenCalledWith({
        email: 'ana@portmaster.test',
        password: 'admin123',
      }),
    );
    expect(loc.hrefs).toContain('/painel');
  });

  it('mostra o erro e não navega quando a autenticação falha', async () => {
    mockedSignIn.mockRejectedValueOnce(new Error('401'));
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => <LoginForm t={t} />);

    setInput(getByLabelText(t.email), 'ana@portmaster.test');
    setInput(getByLabelText(t.password), 'errada');
    await user.click(getByRole('button', { name: t.submit }));

    await waitFor(() => expect(getByRole('alert')).toHaveTextContent(t.invalid));
    expect(loc.hrefs).toHaveLength(0);
  });

  it('não chama o ViewModel quando o formulário é inválido', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => <LoginForm t={t} />);

    setInput(getByLabelText(t.email), 'nao-e-email');
    setInput(getByLabelText(t.password), '123');
    await user.click(getByRole('button', { name: t.submit }));

    await waitFor(() => expect(mockedSignIn).not.toHaveBeenCalled());
  });
});
