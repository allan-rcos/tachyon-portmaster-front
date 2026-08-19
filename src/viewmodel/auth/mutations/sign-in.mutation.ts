/**
 * Autenticação. Quem guarda a credencial é o backend, não esta camada: o
 * `POST /v1/auth/login` responde com `Set-Cookie` de `auth_token` e
 * `refresh_token`, ambos HttpOnly. A View só reage ao sucesso.
 *
 * @packageDocumentation
 */
import { login } from '@model/auth';
import type { LoginFormData } from '@viewmodel/auth/schemas/login.schema';
import { browserClient } from '@viewmodel/core/client/api-client';

/**
 * Autentica o usuário.
 *
 * Não grava cookie nenhum. Havia aqui um `setCookie('auth_token', res.token)`
 * a partir do `token` do corpo — que o contrato mantém só por
 * compatibilidade — e ele não podia funcionar: o navegador ignora uma escrita
 * via `document.cookie` sobre um nome que já existe como HttpOnly, então o
 * melhor caso era um no-op e o pior era uma cópia não-HttpOnly do JWT
 * sombreando a sessão real. O `credentials: 'include'` do `browserClient` é o
 * que faz o cookie do backend ser aceito e reenviado.
 *
 * @param input Credenciais já validadas pelo schema de login.
 */
export async function signIn(input: LoginFormData): Promise<void> {
  await login(browserClient, input);
}
