// ============================================================
//  A tela de login, exercitada da forma como o usuário a encontra.
//
//  Substitui o antigo `LoginForm.island.test.tsx`, que montava o island direto
//  e mockava a mutation para inferir o que o formulário tinha coletado. Agora o
//  estado é do ViewModel: a validação e a submissão têm teste próprio, sem DOM
//  (`login-page.vm.test.ts`), e o que sobra para cá é a LIGAÇÃO — o que o
//  usuário digita chega ao VM, e o que o VM diz aparece na tela.
//
//  Diferente do branch Lit, aqui não há metade de SSR: o `vite-plugin-solid`
//  compila o JSX para o DOM sob a condição `browser` do vitest.config, e o
//  `renderToString` do Solid exige o transform de servidor. Cobrir "HTML
//  completo na 1ª requisição" exigiria um segundo projeto de teste com a
//  condição invertida — fica registrado como lacuna consciente, não esquecida.
// ============================================================
import { fireEvent, render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { stubLocation } from '@view/core/testing/stub-location';
import { loginMessages } from '@viewmodel/auth/i18n/login-page.messages';
import { createLoginVM, type LoginPageData } from '@viewmodel/auth/login-page.vm';
import { signIn } from '@viewmodel/auth/mutations/sign-in.mutation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginPage } from './LoginPage';

vi.mock('@viewmodel/auth/mutations/sign-in.mutation');

const mockedSignIn = vi.mocked(signIn);
const t = loginMessages('pt-BR');

const data: LoginPageData = {
  t,
  meta: { title: t.title, description: t.subtitle },
  redirectTo: '/painel',
};

let loc: ReturnType<typeof stubLocation>;

beforeEach(() => {
  loc = stubLocation();
  mockedSignIn.mockResolvedValue(undefined);
});
afterEach(() => loc.restore());

/** Monta a tela com o VM da rota, como o `+Page` faz. */
function mount(overrides: Partial<LoginPageData> = {}) {
  const vm = createLoginVM({ ...data, ...overrides });
  return { vm, ...render(() => <LoginPage vm={vm} />) };
}

describe('LoginPage', () => {
  it('desenha o formulário completo, sem esqueleto nem ClientOnly', () => {
    const { getByLabelText, getByRole } = mount();

    expect(getByLabelText(t.email)).toBeInTheDocument();
    expect(getByLabelText(t.password)).toBeInTheDocument();
    expect(getByRole('button', { name: t.submit })).toBeInTheDocument();
  });

  it('envia as credenciais ao ViewModel e navega para o destino', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = mount();

    fireEvent.input(getByLabelText(t.email), { target: { value: 'ana@portmaster.test' } });
    fireEvent.input(getByLabelText(t.password), { target: { value: 'admin123' } });
    await user.click(getByRole('button', { name: t.submit }));

    await waitFor(() =>
      expect(mockedSignIn).toHaveBeenCalledWith({
        email: 'ana@portmaster.test',
        password: 'admin123',
      }),
    );
    expect(loc.hrefs).toContain('/painel');
  });

  it('respeita o redirect resolvido pelo ViewModel', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = mount({ redirectTo: '/painel/conteineres' });

    fireEvent.input(getByLabelText(t.email), { target: { value: 'ana@portmaster.test' } });
    fireEvent.input(getByLabelText(t.password), { target: { value: 'admin123' } });
    await user.click(getByRole('button', { name: t.submit }));

    await waitFor(() => expect(loc.hrefs).toContain('/painel/conteineres'));
  });

  it('mostra o erro e não navega quando a autenticação falha', async () => {
    mockedSignIn.mockRejectedValueOnce(new Error('401'));
    const user = userEvent.setup();
    const { getByLabelText, getByRole, container } = mount();

    fireEvent.input(getByLabelText(t.email), { target: { value: 'ana@portmaster.test' } });
    fireEvent.input(getByLabelText(t.password), { target: { value: 'errada' } });
    await user.click(getByRole('button', { name: t.submit }));

    await waitFor(() => expect(visibleAlerts(container)).toContain(t.invalid));
    expect(loc.hrefs).toHaveLength(0);
  });

  it('não chama o ViewModel quando o formulário é inválido, e revela os erros', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole, container } = mount();

    // O e-mail vai BEM FORMADO e a senha vazia: o `<input type="email">` tem
    // validação de formato nativa, e um valor malformado ali faz o navegador
    // (e o jsdom) barrarem o envio antes do nosso handler — o que testaria a
    // constraint do HTML, não o ViewModel. A senha não tem `required`, então é
    // ela quem carrega o caso "envio com campo inválido".
    fireEvent.input(getByLabelText(t.email), { target: { value: 'ana@portmaster.test' } });
    await user.click(getByRole('button', { name: t.submit }));

    expect(mockedSignIn).not.toHaveBeenCalled();
    await waitFor(() => expect(visibleAlerts(container)).toContain(t.passwordRequired));
  });

  it('só mostra o erro de um campo depois que ele é tocado', async () => {
    const { getByLabelText, container } = mount();
    const email = getByLabelText(t.email);

    fireEvent.input(email, { target: { value: 'nao-e-email' } });
    expect(visibleAlerts(container)).toHaveLength(0);

    fireEvent.blur(email);
    await waitFor(() => expect(visibleAlerts(container)).toContain(t.emailInvalid));
  });
});

/** Texto dos `role="alert"` que não estão escondidos. */
function visibleAlerts(container: HTMLElement): (string | undefined)[] {
  return [...container.querySelectorAll('[role="alert"]')]
    .filter((el) => !el.hasAttribute('hidden'))
    .map((el) => el.textContent?.trim());
}
