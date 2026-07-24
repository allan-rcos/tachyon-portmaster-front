import { render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { LoginForm } from './LoginForm.island';

import { loginMessages } from '@/pages/entrar/messages';
import { setInput, stubLocation } from '@/test/utils';

const t = loginMessages('pt-BR');

let loc: ReturnType<typeof stubLocation>;
beforeEach(() => {
  loc = stubLocation();
  document.cookie = 'auth_token=; max-age=0; path=/';
});
afterEach(() => loc.restore());

describe('LoginForm', () => {
  it('autentica credenciais válidas: grava cookie e redireciona', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => <LoginForm t={t} />);

    setInput(getByLabelText('E-mail'), 'ana@portmaster.test');
    setInput(getByLabelText('Senha'), 'admin123');
    await user.click(getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(document.cookie).toContain('auth_token=mock_usr_ana'));
    expect(loc.hrefs).toContain('/painel');
  });

  it('mostra erro em credenciais inválidas', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => <LoginForm t={t} />);

    setInput(getByLabelText('E-mail'), 'ana@portmaster.test');
    setInput(getByLabelText('Senha'), 'errada');
    await user.click(getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(getByRole('alert')).toHaveTextContent('E-mail ou senha inválidos'));
    expect(document.cookie).not.toContain('auth_token=mock');
  });
});
