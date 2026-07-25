import { createUser as apiCreateUser } from '@model/users';

import { browserClient } from '../../core/client/api-client';
import type { UserAdmin } from '../domain';
import type { UserCreateData } from '../schemas/user.schema';

/**
 * Cria um usuário já vinculado aos perfis informados.
 *
 * @param input Dados já validados pelo schema de criação de usuário.
 */
export function createUser(input: UserCreateData): Promise<UserAdmin> {
  return apiCreateUser(browserClient, input);
}
