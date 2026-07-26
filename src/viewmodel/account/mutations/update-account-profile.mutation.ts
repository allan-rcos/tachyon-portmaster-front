import { updateAccount } from '@model/account';
import type { AccountProfile } from '@model/account/dto';
import type { AccountFormData } from '@viewmodel/account/schemas/account.schema';
import { browserClient } from '@viewmodel/core/client/api-client';

/**
 * Atualiza nome e e-mail do próprio usuário autenticado.
 *
 * @param input Dados já validados pelo schema da conta.
 */
export function updateAccountProfile(input: AccountFormData): Promise<AccountProfile> {
  return updateAccount(browserClient, input);
}
