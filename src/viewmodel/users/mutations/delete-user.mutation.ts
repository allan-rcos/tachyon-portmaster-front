import { deleteUser as apiDeleteUser } from '@model/users';
import { browserClient } from '@viewmodel/core/client/api-client';

/**
 * Remove um usuário.
 *
 * @param id Identificador opaco do usuário.
 */
export async function deleteUser(id: string): Promise<void> {
  await apiDeleteUser(browserClient, id);
}
