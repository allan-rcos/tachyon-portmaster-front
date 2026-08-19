/**
 * Encerramento de sessão. Assim como o login, quem manda no cookie é o
 * backend: o `POST /v1/auth/logout` responde com `Set-Cookie` expirado para
 * `auth_token` e `refresh_token`.
 *
 * @packageDocumentation
 */
import { logout } from '@model/auth';
import { browserClient } from '@viewmodel/core/client/api-client';

/**
 * Encerra a sessão no backend.
 *
 * A View chamava `deleteCookie('auth_token')` e navegava para `/entrar` — o
 * que nunca deslogou ninguém: o cookie é HttpOnly e `document.cookie` não o
 * apaga. Bastava voltar a uma rota do painel para o guard revalidar a sessão
 * ainda viva. Só o backend consegue expirá-lo.
 *
 * Nunca rejeita: se a chamada falhar, a View ainda deve sair da área logada, e
 * um erro de rede no logout não é algo que o usuário possa resolver.
 */
export async function signOut(): Promise<void> {
  try {
    await logout(browserClient);
  } catch {
    // Sessão possivelmente já expirada no servidor — seguir para o login.
  }
}
