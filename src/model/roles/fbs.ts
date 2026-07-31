import { toBytes, buf, fromT } from '@model/core/fbs-runtime';

import type { Role, RoleCreateRequest, RoleUpdatePermissionsRequest, RoleList } from './dto';

import { RoleResponse as FbRoleResponse } from '@/fbs/api/fbs/account/role-response';
import { RoleCreateRequestT } from '@/fbs/api/fbs/admin/role-create-request';
import { RoleListResponse as FbRoleListResponse } from '@/fbs/api/fbs/admin/role-list-response';
import { RolePermissionsUpdateRequestT } from '@/fbs/api/fbs/admin/role-permissions-update-request';

// As permissões viajam como slugs (`[string]`), não mais como índices de enum:
// o catálogo virou linha de registro no backend, então não há enum no `.fbs`
// para indexar — o mesmo texto vai no wire FBS e no JSON.
export const encRoleCreate = (v: RoleCreateRequest): Uint8Array =>
  toBytes(new RoleCreateRequestT(v.name, [...v.permissions]));

export const encRolePermissions = (v: RoleUpdatePermissionsRequest): Uint8Array =>
  toBytes(new RolePermissionsUpdateRequestT([...v.permissions]));

export const decRole = (b: Uint8Array): Role =>
  fromT(FbRoleResponse.getRootAsRoleResponse(buf(b)).unpack()) as Role;

export const decRoleList = (b: Uint8Array): RoleList =>
  fromT(FbRoleListResponse.getRootAsRoleListResponse(buf(b)).unpack()) as RoleList;
