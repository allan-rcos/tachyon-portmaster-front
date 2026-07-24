import { RoleResponse as FbRoleResponse } from '../fbs-gen/api/fbs/account/role-response';
import { RoleCreateRequestT } from '../fbs-gen/api/fbs/admin/role-create-request';
import { RoleListResponse as FbRoleListResponse } from '../fbs-gen/api/fbs/admin/role-list-response';
import { toBytes, buf, fromT, permIndexes } from '../core/fbs-runtime';

import type { Role, RoleCreateRequest, RoleList } from './dto';

export const encRoleCreate = (v: RoleCreateRequest): Uint8Array =>
  toBytes(new RoleCreateRequestT(v.name, permIndexes(v.permissions)));

export const decRole = (b: Uint8Array): Role =>
  fromT(FbRoleResponse.getRootAsRoleResponse(buf(b)).unpack()) as Role;

export const decRoleList = (b: Uint8Array): RoleList =>
  fromT(FbRoleListResponse.getRootAsRoleListResponse(buf(b)).unpack()) as RoleList;
