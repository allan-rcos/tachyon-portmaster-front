import { updateAccount } from '@model/account';

import { browserClient } from '../../core/client/api-client';
import type { AccountProfile } from '../domain';
import type { AccountFormData } from '../schemas/account.schema';

/**
 * Atualiza nome e e-mail do próprio usuário autenticado.
 *
 * @param input Dados já validados pelo schema da conta.
 */
export function updateAccountProfile(input: AccountFormData): Promise<AccountProfile> {
  return updateAccount(browserClient, input);
}
