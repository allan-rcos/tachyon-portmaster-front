import { UserAdminPasswordResetRequestT } from '../fbs-gen/api/fbs/admin/user-admin-password-reset-request';
import { UserAdminResponse as FbUserAdminResponse } from '../fbs-gen/api/fbs/admin/user-admin-response';
import { UserCreateRequestT } from '../fbs-gen/api/fbs/admin/user-create-request';
import { UserUpdateRequestT } from '../fbs-gen/api/fbs/admin/user-update-request';
import { toBytes, buf, fromT } from '../core/fbs-runtime';

import type { UserAdmin, UserCreateRequest, UserUpdateRequest, UserAdminPasswordResetRequest } from './dto';

export const encUserCreate = (v: UserCreateRequest): Uint8Array =>
  toBytes(new UserCreateRequestT(v.name, v.email, v.initial_password, v.role_ids));

export const encUserUpdate = (v: UserUpdateRequest): Uint8Array =>
  toBytes(new UserUpdateRequestT(v.name, v.email));

export const encUserResetPassword = (v: UserAdminPasswordResetRequest): Uint8Array =>
  toBytes(new UserAdminPasswordResetRequestT(v.new_password));

export const decUserAdmin = (b: Uint8Array): UserAdmin =>
  fromT(FbUserAdminResponse.getRootAsUserAdminResponse(buf(b)).unpack()) as UserAdmin;
