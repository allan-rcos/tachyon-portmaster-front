import type { Role, RoleCreateRequest, RoleList } from './dto';
import { toBytes, buf, fromT, permIndexes } from '../core/fbs-runtime';
import { RoleResponse as FbRoleResponse } from '../generated/fbs/api/fbs/account/role-response';
import { RoleCreateRequestT } from '../generated/fbs/api/fbs/admin/role-create-request';
import { RoleListResponse as FbRoleListResponse } from '../generated/fbs/api/fbs/admin/role-list-response';

export const encRoleCreate = (v: RoleCreateRequest): Uint8Array =>
  toBytes(new RoleCreateRequestT(v.name, permIndexes(v.permissions)));

export const decRole = (b: Uint8Array): Role =>
  fromT(FbRoleResponse.getRootAsRoleResponse(buf(b)).unpack()) as Role;

export const decRoleList = (b: Uint8Array): RoleList =>
  fromT(FbRoleListResponse.getRootAsRoleListResponse(buf(b)).unpack()) as RoleList;
