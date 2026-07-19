import { enc, dec } from '@/services/fbs';
import type {
  Role,
  RoleCreateRequest,
  RoleUpdatePermissionsRequest,
  RoleList,
} from '@/services/gen/flow/v1/admin';
import type { Codec, CallArgs } from '@/services/http';

export const listRoles: Codec<CallArgs, RoleList> = {
  method: 'GET',
  path: () => '/v1/roles',
  encode: () => undefined,
  decode: (raw) => raw as RoleList,
  fbsDecode: dec.roleList,
};

export const createRole: Codec<CallArgs<RoleCreateRequest>, Role> = {
  method: 'POST',
  path: () => '/v1/roles',
  encode: (r) => r.body,
  decode: (raw) => raw as Role,
  fbsEncode: (r) => enc.roleCreate(r.body!),
  fbsDecode: dec.role,
};

// Sem tabela FBS para o corpo (RoleUpdatePermissionsRequest) → corpo JSON, resposta FBS.
export const updateRolePermissions: Codec<CallArgs<RoleUpdatePermissionsRequest>, Role> = {
  method: 'PUT',
  path: (r) => `/v1/roles/${r.params!.id}/permissions`,
  encode: (r) => r.body,
  decode: (raw) => raw as Role,
  fbsDecode: dec.role,
};
