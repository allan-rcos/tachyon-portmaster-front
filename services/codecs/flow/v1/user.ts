import { enc, dec } from '@/services/fbs';
import type {
  UserAdmin,
  UserCreateRequest,
  UserUpdateRequest,
  UserAdminPasswordResetRequest,
  UserUpdateRolesRequest,
  UserList,
} from '@/services/gen/flow/v1/admin';
import type { Codec, CallArgs } from '@/services/http';

// Lista de usuários não tem tabela FlatBuffers no schema → wire JSON.
export const listUsers: Codec<CallArgs, UserList> = {
  method: 'GET',
  path: () => '/v1/users',
  encode: () => undefined,
  decode: (raw) => raw as UserList,
};

export const getUser: Codec<CallArgs, UserAdmin> = {
  method: 'GET',
  path: (r) => `/v1/users/${r.params!.id}`,
  encode: () => undefined,
  decode: (raw) => raw as UserAdmin,
  fbsDecode: dec.userAdmin,
};

export const createUser: Codec<CallArgs<UserCreateRequest>, UserAdmin> = {
  method: 'POST',
  path: () => '/v1/users',
  encode: (r) => r.body,
  decode: (raw) => raw as UserAdmin,
  fbsEncode: (r) => enc.userCreate(r.body!),
  fbsDecode: dec.userAdmin,
};

export const updateUser: Codec<CallArgs<UserUpdateRequest>, UserAdmin> = {
  method: 'PUT',
  path: (r) => `/v1/users/${r.params!.id}`,
  encode: (r) => r.body,
  decode: (raw) => raw as UserAdmin,
  fbsEncode: (r) => enc.userUpdate(r.body!),
  fbsDecode: dec.userAdmin,
};

export const deleteUser: Codec<CallArgs, null> = {
  method: 'DELETE',
  path: (r) => `/v1/users/${r.params!.id}`,
  encode: () => undefined,
  decode: () => null,
};

export const resetUserPassword: Codec<CallArgs<UserAdminPasswordResetRequest>, null> = {
  method: 'PUT',
  path: (r) => `/v1/users/${r.params!.id}/password`,
  encode: (r) => r.body,
  decode: () => null,
  fbsEncode: (r) => enc.userResetPassword(r.body!),
};

// Sem tabela FBS para o corpo (UserUpdateRolesRequest) → corpo JSON, resposta FBS.
export const updateUserRoles: Codec<CallArgs<UserUpdateRolesRequest>, UserAdmin> = {
  method: 'PUT',
  path: (r) => `/v1/users/${r.params!.id}/roles`,
  encode: (r) => r.body,
  decode: (raw) => raw as UserAdmin,
  fbsDecode: dec.userAdmin,
};
