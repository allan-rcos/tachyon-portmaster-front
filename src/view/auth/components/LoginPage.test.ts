// ============================================================
//  A tela de login, exercitada como o navegador a recebe: HTML do servidor →
//  hidratação → interação.
//
//  Substitui o antigo `LoginForm.island.test.tsx`, que montava o island direto
//  no cliente. Testar a partir do SSR é mais fiel e cobre de graça a promessa
//  central do projeto — "HTML completo na 1ª requisição" — que antes nenhum
//  teste verificava.
//
//  A validação e a submissão em si são do ViewModel e têm teste próprio
//  (`login-page.vm.test.ts`), sem DOM. Aqui verificamos a ligação: o que o
//  usuário digita chega ao VM, e o que o VM diz aparece na tela.
// ============================================================
import { render as renderSsr } from '@lit-labs/ssr/lib/render-lit-html.js';
import { collectResultSync } from '@lit-labs/ssr/lib/render-result.js';
import { hydrate } from '@lit-labs/ssr-client';
import userEvent from '@testing-library/user-event';
import { stubLocation } from '@view/core/testing/stub-location';
import { loginMessages } from '@viewmodel/auth/i18n/login-page.messages';
import { createLoginVM, type LoginPageData } from '@viewmodel/auth/login-page.vm';
import { signIn } from '@viewmodel/auth/mutations/sign-in.mutation';
import { effect } from 'alien-signals';
import { render } from 'lit';
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
let stop: (() => void) | undefined;

beforeEach(() => {
  loc = stubLocation();
  mockedSignIn.mockResolvedValue(undefined);
});
afterEach(() => {
  stop?.();
  stop = undefined;
  loc.restore();
});

/**
 * Reproduz o ciclo do `vike-lit`: serializa no "servidor", hidrata sobre esse
 * HTML e liga o effect raiz.
 */
function mount(overrides: Partial<LoginPageData> = {}) {
  const vm = createLoginVM({ ...data, ...overrides });
  const view = () => LoginPage({ vm });

  const container = document.createElement('div');
  container.innerHTML = collectResultSync(renderSsr(view()));
  document.body.append(container);

  const serverForm = container.querySelector('form');
  hydrate(view(), container);
  // Corpo em BLOCO, e não `() => render(...)`: o `effect` do alien-signals trata
  // o retorno como função de limpeza, e o `render` do lit devolve um `RootPart`.
  stop = effect(() => {
    render(view(), container);
  });

  return { container, vm, serverForm };
}

const email = () => document.getElementById('email') as HTMLInputElement;
const password = () => document.getElementById('password') as HTMLInputElement;
const submitButton = () => document.querySelector('button[type="submit"]') as HTMLButtonElement;

describe('LoginPage', () => {
  it('sai do servidor com o formulário completo, sem depender de JS', () => {
    const vm = createLoginVM(data);
    const html = collectResultSync(renderSsr(LoginPage({ vm })));

    expect(html).toContain('type="email"');
    expect(html).toContain('type="password"');
    expect(html).toContain('type="submit"');
    expect(html).toContain(t.title);
    expect(html).toContain(t.subtitle);
  });

  it('hidrata reaproveitando o DOM do servidor', () => {
    const { container, serverForm } = mount();
    // Se a hidratação falhasse, o lit-html teria reconstruído a árvore.
    expect(container.querySelector('form')).toBe(serverForm);
  });

  it('envia as credenciais ao ViewModel e navega para o destino', async () => {
    const user = userEvent.setup();
    mount();

    await user.type(email(), 'ana@portmaster.test');
    await user.type(password(), 'admin123');
    await user.click(submitButton());

    expect(mockedSignIn).toHaveBeenCalledWith({
      email: 'ana@portmaster.test',
      password: 'admin123',
    });
    expect(loc.hrefs).toContain('/painel');
  });

  it('respeita o redirect resolvido pelo ViewModel', async () => {
    const user = userEvent.setup();
    mount({ redirectTo: '/painel/conteineres' });

    await user.type(email(), 'ana@portmaster.test');
    await user.type(password(), 'admin123');
    await user.click(submitButton());

    expect(loc.hrefs).toContain('/painel/conteineres');
  });

  it('mostra o erro e não navega quando a autenticação falha', async () => {
    mockedSignIn.mockRejectedValueOnce(new Error('401'));
    const user = userEvent.setup();
    const { container } = mount();

    await user.type(email(), 'ana@portmaster.test');
    await user.type(password(), 'errada');
    await user.click(submitButton());

    const alerts = [...container.querySelectorAll('[role="alert"]')].filter(
      (el) => !el.hasAttribute('hidden'),
    );
    expect(alerts.map((el) => el.textContent?.trim())).toContain(t.invalid);
    expect(loc.hrefs).toHaveLength(0);
  });

  it('não chama o ViewModel quando o formulário é inválido, e revela os erros', async () => {
    const user = userEvent.setup();
    const { container } = mount();

    // Senha fica vazia de propósito: dois campos inválidos, um por regra
    // diferente (formato e obrigatoriedade).
    await user.type(email(), 'nao-e-email');
    await user.click(submitButton());

    expect(mockedSignIn).not.toHaveBeenCalled();
    const visible = [...container.querySelectorAll('[role="alert"]')]
      .filter((el) => !el.hasAttribute('hidden'))
      .map((el) => el.textContent?.trim());
    expect(visible).toContain(t.emailInvalid);
  });

  it('só mostra o erro de um campo depois que ele é tocado', async () => {
    const user = userEvent.setup();
    const { container } = mount();

    await user.type(email(), 'nao-e-email');
    const before = [...container.querySelectorAll('[role="alert"]')].filter(
      (el) => !el.hasAttribute('hidden'),
    );
    expect(before).toHaveLength(0);

    await user.tab(); // blur
    const after = [...container.querySelectorAll('[role="alert"]')]
      .filter((el) => !el.hasAttribute('hidden'))
      .map((el) => el.textContent?.trim());
    expect(after).toContain(t.emailInvalid);
  });
});
