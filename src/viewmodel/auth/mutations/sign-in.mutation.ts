/**
 * Autenticação. A mutation não devolve o token cru para a View: ela já o
 * persiste no cookie de sessão, porque "onde a credencial é guardada" é
 * decisão do ViewModel, não da interface. A View só reage ao sucesso.
 *
 * @packageDocumentation
 */
import { login } from '@model/auth';
import type { LoginFormData } from '@viewmodel/auth/schemas/login.schema';
import { browserClient } from '@viewmodel/core/client/api-client';
import { setCookie } from '@viewmodel/core/utils/cookies';

/**
 * Autentica o usuário e grava o cookie `auth_token` da sessão.
 *
 * @param input Credenciais já validadas pelo schema de login.
 */
export async function signIn(input: LoginFormData): Promise<void> {
  const res = await login(browserClient, input);
  setCookie('auth_token', res.token);
}
