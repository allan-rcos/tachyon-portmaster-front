import { createRole as apiCreateRole } from '@model/roles';
import type { Role } from '@model/roles/dto';
import { browserClient } from '@viewmodel/core/client/api-client';
import type { RoleFormData } from '@viewmodel/roles/schemas/role.schema';

/**
 * Cria um perfil de acesso com o conjunto inicial de permissões.
 *
 * @param input Nome e permissões já validados pelo schema de perfil.
 */
export function createRole(input: RoleFormData): Promise<Role> {
  return apiCreateRole(browserClient, input);
}
