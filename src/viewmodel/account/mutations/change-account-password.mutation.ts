import { changePassword } from '@model/account';

import { browserClient } from '../../core/client/api-client';
import type { PasswordChangeData } from '../schemas/account.schema';

/**
 * Troca a senha do próprio usuário autenticado.
 *
 * @param input Senha atual e nova, já validadas pelo schema.
 */
export function changeAccountPassword(input: PasswordChangeData): Promise<null> {
  return changePassword(browserClient, input);
}
