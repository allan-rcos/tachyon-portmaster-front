import type { ApiClient } from '@model/core/http';
import { wire } from '@model/core/wire';

import type { Role, RoleCreateRequest, RoleUpdatePermissionsRequest, RoleList } from './dto';
import { encRoleCreate, encRolePermissions, decRole, decRoleList } from './fbs';

export const listRoles = (c: ApiClient, query?: Record<string, string>): Promise<RoleList> =>
  wire(c, { method: 'GET', path: '/v1/roles', query, decode: decRoleList });

export const createRole = (c: ApiClient, body: RoleCreateRequest): Promise<Role> =>
  wire(c, { method: 'POST', path: '/v1/roles', body, encode: encRoleCreate, decode: decRole });

export const updateRolePermissions = (
  c: ApiClient,
  id: string,
  body: RoleUpdatePermissionsRequest,
): Promise<Role> =>
  wire(c, {
    method: 'PUT',
    path: `/v1/roles/${id}/permissions`,
    body,
    encode: encRolePermissions,
    decode: decRole,
  });
