import { changePassword } from '@model/account';
import type { PasswordChangeData } from '@viewmodel/account/schemas/account.schema';
import { browserClient } from '@viewmodel/core/client/api-client';

/** O corpo que a API aceita — o schema do formulário tem um campo a mais. */
export type ChangePasswordInput = Omit<PasswordChangeData, 'confirm_password'>;

/**
 * Troca a senha do próprio usuário autenticado.
 *
 * O tipo exclui `confirm_password` de propósito: a confirmação é campo de
 * FORMULÁRIO — existe para pegar erro de digitação numa senha que ninguém
 * consegue reler — e o contrato da API não a conhece. Deixá-la fora da
 * assinatura faz o `tsc` impedir que ela vaze para o Model, em vez de depender
 * de alguém lembrar de removê-la.
 *
 * @param input Senha atual e nova, já validadas pelo schema.
 */
export function changeAccountPassword(input: ChangePasswordInput): Promise<null> {
  return changePassword(browserClient, input);
}
