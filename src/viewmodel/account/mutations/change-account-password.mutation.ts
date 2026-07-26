import { changePassword } from '@model/account';
import type { PasswordChangeData } from '@viewmodel/account/schemas/account.schema';
import { browserClient } from '@viewmodel/core/client/api-client';

/**
 * Troca a senha do próprio usuário autenticado.
 *
 * @param input Senha atual e nova, já validadas pelo schema.
 */
export function changeAccountPassword(input: PasswordChangeData): Promise<null> {
  return changePassword(browserClient, input);
}
