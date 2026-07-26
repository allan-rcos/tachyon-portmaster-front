import type { Permission } from '@model/common/dto';
import { updateRolePermissions as apiUpdateRolePermissions } from '@model/roles';
import type { Role } from '@model/roles/dto';
import { browserClient } from '@viewmodel/core/client/api-client';

/**
 * Sincroniza o conjunto de permissões de um perfil (substitui, não acumula).
 *
 * @param id          Identificador opaco do perfil.
 * @param permissions Conjunto completo de permissões desejado.
 */
export function updateRolePermissions(
  id: string,
  permissions: readonly Permission[],
): Promise<Role> {
  return apiUpdateRolePermissions(browserClient, id, { permissions: [...permissions] });
}
