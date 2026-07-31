/**
 * A API separa "dados do usuário" de "perfis do usuário" em dois endpoints,
 * mas para a interface é uma única edição. Compor as duas chamadas é trabalho
 * do ViewModel — a View não deveria saber que existem dois recursos.
 *
 * @packageDocumentation
 */
import { updateUser as apiUpdateUser, updateUserRoles } from '@model/users';
import type { UserAdmin } from '@model/users/dto';
import { browserClient } from '@viewmodel/core/client/api-client';
import type { UserUpdateData } from '@viewmodel/users/schemas/user.schema';

/**
 * Atualiza dados e perfis de um usuário numa operação só.
 *
 * @param id    Identificador opaco do usuário.
 * @param input Dados já validados pelo schema de edição de usuário.
 */
export async function updateUser(id: string, input: UserUpdateData): Promise<UserAdmin> {
  await apiUpdateUser(browserClient, id, { name: input.name, email: input.email });
  return updateUserRoles(browserClient, id, { role_ids: input.role_ids });
}
