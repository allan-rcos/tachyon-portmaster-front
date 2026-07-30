// ============================================================
//  Rota /entrar — as duas metades do MVVM desta tela.
//
//   • `loadLoginPage` é o DATA: resolve texto e destino do redirect a partir da
//     requisição, e devolve dado PURO e SERIALIZÁVEL.
//
//   • `createLoginVM` é a REATIVIDADE: o estado do formulário mora AQUI, e não
//     no island. Antes ele vivia na View, no `@tanstack/solid-form` — mas o que
//     um formulário guarda (valores, o que já foi tocado, se está enviando, se
//     falhou) é estado de aplicação, e estado de aplicação é do ViewModel. A
//     consequência prática: dá para testar validação e submissão sem DOM, e o
//     island vira desenho puro.
//
//  Não há abstração de formulário no meio. As peças são as que já existiam:
//  `signal`/`computed` do alien-signals, o schema Zod desta feature, e a
//  mutation. É o mesmo `try/catch/finally` que os VMs de listagem já usam.
// ============================================================

import { resolveLocale } from '@viewmodel/core/i18n/locale';
import type { PageMeta, PageRequest } from '@viewmodel/core/page/page-request';
import { computed, signal } from 'alien-signals';
import { z } from 'zod';

import { loginMessages, type LoginPageText } from './i18n/login-page.messages';
import { signIn } from './mutations/sign-in.mutation';
import { createLoginSchema, type LoginFormData } from './schemas/login.schema';

/** Campos do formulário. */
export type LoginField = keyof LoginFormData;

/** Dados que a rota entrega à View. */
export interface LoginPageData {
  /** Texto da tela, já no locale da requisição. */
  t: LoginPageText;
  /**
   * `<title>`/`<description>` da rota.
   *
   * Mesmo formato das rotas de `/painel`, e não mais `title`/`description`
   * soltos: o `<head>` é resolvido num lugar só (`pages/+config.js`), então as
   * rotas precisam falar a mesma língua. Antes o login caía no título genérico
   * porque o `+Head` só sabia ler `data.meta`.
   */
  meta: PageMeta;
  /**
   * Para onde ir depois de autenticar.
   *
   * Resolvido aqui, do `?redirect=` da URL, e não no navegador: assim a regra
   * (só caminho interno, senão o painel) é a mesma nos dois lados e testável
   * com um objeto literal.
   */
  redirectTo: string;
}

/**
 * Resolve `?redirect=` para um destino seguro.
 *
 * Só aceita caminho absoluto interno — um `//evil.com` ou `https://…` viraria
 * redirect aberto.
 *
 * @param url URL da requisição.
 */
function resolveRedirect(url: string): string {
  const target = new URL(url, 'http://localhost').searchParams.get('redirect');
  if (!target || !target.startsWith('/') || target.startsWith('//')) return '/painel';
  return target;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadLoginPage(request: PageRequest): Promise<LoginPageData> {
  const t = loginMessages(resolveLocale(request.headers));
  return {
    t,
    meta: { title: t.title, description: t.subtitle },
    redirectTo: resolveRedirect(request.url),
  };
}

/** Superfície reativa do formulário de login. */
export interface LoginVM {
  /** Texto da tela. */
  t: LoginPageText;
  /** Destino após autenticar. Quem navega é a View. */
  redirectTo: string;
  /** Valor atual de um campo. */
  value: (field: LoginField) => string;
  /**
   * Erro de um campo, ou `undefined`.
   *
   * Só aparece depois que o campo foi tocado (ou depois de uma tentativa de
   * envio): validar em cima de quem ainda está digitando é ruído.
   */
  error: (field: LoginField) => string | undefined;
  /** Uma submissão está em voo. */
  submitting: () => boolean;
  /** A última tentativa falhou na API (credencial inválida). */
  failed: () => boolean;
  /** Escreve um campo. */
  set: (field: LoginField, value: string) => void;
  /** Marca um campo como tocado, liberando o erro dele. */
  blur: (field: LoginField) => void;
  /**
   * Valida e autentica.
   *
   * Nunca rejeita — o erro vira estado.
   *
   * @returns `true` se autenticou; a View então navega para `redirectTo`.
   */
  submit: () => Promise<boolean>;
}

/**
 * Cria o ViewModel do formulário de login.
 *
 * @param data Dado da rota, vindo do `+data`.
 */
export function createLoginVM(data: LoginPageData): LoginVM {
  const schema = createLoginSchema(data.t);
  const values = signal<LoginFormData>({ email: '', password: '' });
  const touched = signal<ReadonlySet<LoginField>>(new Set());
  const submitting = signal(false);
  const failed = signal(false);

  // Revalida a cada tecla, mas só o que a View mostra é filtrado por `touched`.
  const problems = computed(() => {
    const result = schema.safeParse(values());
    return result.success ? {} : z.flattenError(result.error).fieldErrors;
  });

  return {
    t: data.t,
    redirectTo: data.redirectTo,
    value: (field) => values()[field],
    error: (field) => (touched().has(field) ? problems()[field]?.[0] : undefined),
    submitting,
    failed,
    set: (field, value) => {
      values({ ...values(), [field]: value });
      failed(false);
    },
    blur: (field) => touched(new Set(touched()).add(field)),
    submit: async () => {
      const result = schema.safeParse(values());
      if (!result.success) {
        // Enviar com campo inválido revela todos os erros de uma vez.
        touched(new Set<LoginField>(['email', 'password']));
        return false;
      }
      submitting(true);
      failed(false);
      try {
        await signIn(result.data);
        return true;
      } catch {
        failed(true);
        return false;
      } finally {
        submitting(false);
      }
    },
  };
}
