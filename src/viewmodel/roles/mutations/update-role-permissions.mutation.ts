import { updateRolePermissions as apiUpdateRolePermissions } from '@model/roles';

import { browserClient } from '../../core/client/api-client';
import type { Permission } from '../../core/domain';
import type { Role } from '../domain';

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
