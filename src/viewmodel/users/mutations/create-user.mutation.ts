import { createUser as apiCreateUser } from '@model/users';
import type { UserAdmin } from '@model/users/dto';
import { browserClient } from '@viewmodel/core/client/api-client';
import type { UserCreateData } from '@viewmodel/users/schemas/user.schema';

/**
 * Cria um usuário já vinculado aos perfis informados.
 *
 * @param input Dados já validados pelo schema de criação de usuário.
 */
export function createUser(input: UserCreateData): Promise<UserAdmin> {
  return apiCreateUser(browserClient, input);
}
