import type { Role, RoleCreateRequest, RoleUpdatePermissionsRequest, RoleList } from './dto';
import { encRoleCreate, decRole, decRoleList } from './fbs';
import type { ApiClient } from '../core/http';
import { wire } from '../core/wire';


export const listRoles = (c: ApiClient, query?: Record<string, string>): Promise<RoleList> =>
  wire(c, { method: 'GET', path: '/v1/roles', query, decode: decRoleList });

export const createRole = (c: ApiClient, body: RoleCreateRequest): Promise<Role> =>
  wire(c, { method: 'POST', path: '/v1/roles', body, encode: encRoleCreate, decode: decRole });

// Sem tabela FBS para o corpo (RoleUpdatePermissionsRequest) → corpo JSON, resposta FBS.
export const updateRolePermissions = (
  c: ApiClient,
  id: string,
  body: RoleUpdatePermissionsRequest,
): Promise<Role> =>
  wire(c, { method: 'PUT', path: `/v1/roles/${id}/permissions`, body, decode: decRole });
