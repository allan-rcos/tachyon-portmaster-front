// ============================================================
//  O que antes só era testável renderizando um island — validação, "já tocou",
//  estado de envio — agora é testável sem DOM nenhum, porque o estado do
//  formulário mora aqui.
// ============================================================
import { signIn } from '@viewmodel/auth/mutations/sign-in.mutation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loginMessages } from './i18n/login-page.messages';
import { createLoginVM, loadLoginPage, type LoginPageData } from './login-page.vm';

vi.mock('@viewmodel/auth/mutations/sign-in.mutation');

const mockedSignIn = vi.mocked(signIn);
const t = loginMessages('pt-BR');

const data: LoginPageData = {
  t,
  meta: { title: t.title, description: t.subtitle },
  redirectTo: '/painel',
};

beforeEach(() => {
  mockedSignIn.mockResolvedValue(undefined);
});

describe('loadLoginPage', () => {
  it('resolve o redirect a partir da URL', async () => {
    const result = await loadLoginPage({
      url: '/entrar?redirect=%2Fpainel%2Fconteineres',
      headers: undefined,
      routeParams: {},
    });
    expect(result.redirectTo).toBe('/painel/conteineres');
  });

  it('cai no painel quando não há redirect', async () => {
    const result = await loadLoginPage({ url: '/entrar', headers: undefined, routeParams: {} });
    expect(result.redirectTo).toBe('/painel');
  });

  it.each(['//evil.com', 'https://evil.com', 'javascript:alert(1)'])(
    'recusa destino externo (%s) — seria redirect aberto',
    async (target) => {
      const result = await loadLoginPage({
        url: `/entrar?redirect=${encodeURIComponent(target)}`,
        headers: undefined,
        routeParams: {},
      });
      expect(result.redirectTo).toBe('/painel');
    },
  );
});

describe('createLoginVM', () => {
  it('só revela o erro depois que o campo é tocado', () => {
    const vm = createLoginVM(data);

    vm.set('email', 'nao-e-email');
    expect(vm.error('email')).toBeUndefined();

    vm.blur('email');
    expect(vm.error('email')).toBe(t.emailInvalid);
  });

  it('some com o erro quando o valor fica válido', () => {
    const vm = createLoginVM(data);
    vm.set('email', 'nao-e-email');
    vm.blur('email');
    expect(vm.error('email')).toBe(t.emailInvalid);

    vm.set('email', 'ana@portmaster.test');
    expect(vm.error('email')).toBeUndefined();
  });

  it('não chama a mutation com formulário inválido, e revela todos os erros', async () => {
    const vm = createLoginVM(data);
    vm.set('email', 'nao-e-email');

    await expect(vm.submit()).resolves.toBe(false);

    expect(mockedSignIn).not.toHaveBeenCalled();
    expect(vm.error('email')).toBe(t.emailInvalid);
    expect(vm.error('password')).toBe(t.passwordRequired);
  });

  it('autentica e sinaliza sucesso — quem navega é a View', async () => {
    const vm = createLoginVM(data);
    vm.set('email', 'ana@portmaster.test');
    vm.set('password', 'admin123');

    await expect(vm.submit()).resolves.toBe(true);

    expect(mockedSignIn).toHaveBeenCalledWith({
      email: 'ana@portmaster.test',
      password: 'admin123',
    });
    expect(vm.failed()).toBe(false);
  });

  it('transforma a falha da API em estado, sem rejeitar', async () => {
    mockedSignIn.mockRejectedValueOnce(new Error('401'));
    const vm = createLoginVM(data);
    vm.set('email', 'ana@portmaster.test');
    vm.set('password', 'errada');

    await expect(vm.submit()).resolves.toBe(false);
    expect(vm.failed()).toBe(true);
    expect(vm.submitting()).toBe(false);
  });

  it('limpa a falha assim que o usuário corrige alguma coisa', async () => {
    mockedSignIn.mockRejectedValueOnce(new Error('401'));
    const vm = createLoginVM(data);
    vm.set('email', 'ana@portmaster.test');
    vm.set('password', 'errada');
    await vm.submit();
    expect(vm.failed()).toBe(true);

    vm.set('password', 'admin123');
    expect(vm.failed()).toBe(false);
  });

  it('marca `submitting` enquanto a mutation está em voo', async () => {
    let resolveSignIn: () => void = () => {};
    mockedSignIn.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveSignIn = resolve;
        }),
    );

    const vm = createLoginVM(data);
    vm.set('email', 'ana@portmaster.test');
    vm.set('password', 'admin123');

    const pending = vm.submit();
    expect(vm.submitting()).toBe(true);

    resolveSignIn();
    await pending;
    expect(vm.submitting()).toBe(false);
  });
});
