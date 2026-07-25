import { createRole as apiCreateRole } from '@model/roles';

import { browserClient } from '../../core/client/api-client';
import type { Role } from '../domain';
import type { RoleFormData } from '../schemas/role.schema';

/**
 * Cria um perfil de acesso com o conjunto inicial de permissões.
 *
 * @param input Nome e permissões já validados pelo schema de perfil.
 */
export function createRole(input: RoleFormData): Promise<Role> {
  return apiCreateRole(browserClient, input);
}
