import type {
  UserAdmin,
  UserCreateRequest,
  UserUpdateRequest,
  UserAdminPasswordResetRequest,
  UserUpdateRolesRequest,
  UserList,
} from './dto';
import { encUserCreate, encUserUpdate, encUserResetPassword, decUserAdmin } from './fbs';
import type { ApiClient } from '../core/http';
import { wire } from '../core/wire';


// Lista de usuários não tem tabela FlatBuffers no schema → wire JSON.
export const listUsers = (c: ApiClient, query?: Record<string, string>): Promise<UserList> =>
  wire(c, { method: 'GET', path: '/v1/users', query });

export const getUser = (c: ApiClient, id: string): Promise<UserAdmin> =>
  wire(c, { method: 'GET', path: `/v1/users/${id}`, decode: decUserAdmin });

export const createUser = (c: ApiClient, body: UserCreateRequest): Promise<UserAdmin> =>
  wire(c, { method: 'POST', path: '/v1/users', body, encode: encUserCreate, decode: decUserAdmin });

export const updateUser = (c: ApiClient, id: string, body: UserUpdateRequest): Promise<UserAdmin> =>
  wire(c, {
    method: 'PUT',
    path: `/v1/users/${id}`,
    body,
    encode: encUserUpdate,
    decode: decUserAdmin,
  });

export const deleteUser = (c: ApiClient, id: string): Promise<null> =>
  wire(c, { method: 'DELETE', path: `/v1/users/${id}` });

export const resetUserPassword = (
  c: ApiClient,
  id: string,
  body: UserAdminPasswordResetRequest,
): Promise<null> =>
  wire(c, { method: 'PUT', path: `/v1/users/${id}/password`, body, encode: encUserResetPassword });

// Sem tabela FBS para o corpo (UserUpdateRolesRequest) → corpo JSON, resposta FBS.
export const updateUserRoles = (
  c: ApiClient,
  id: string,
  body: UserUpdateRolesRequest,
): Promise<UserAdmin> =>
  wire(c, { method: 'PUT', path: `/v1/users/${id}/roles`, body, decode: decUserAdmin });
