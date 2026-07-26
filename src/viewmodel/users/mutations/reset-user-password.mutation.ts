import { resetUserPassword as apiResetUserPassword } from '@model/users';
import { browserClient } from '@viewmodel/core/client/api-client';

/**
 * Define uma nova senha para um usuário (ação administrativa).
 *
 * @param id          Identificador opaco do usuário.
 * @param newPassword Senha já validada pelo schema de reset.
 */
export async function resetUserPassword(id: string, newPassword: string): Promise<void> {
  await apiResetUserPassword(browserClient, id, { new_password: newPassword });
}
