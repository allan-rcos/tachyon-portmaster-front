import type { Paged } from '../common/dto';
import type { RoleRef } from '../account/dto';

export interface UserAdmin {
  id: string;
  name: string;
  email: string;
  roles: RoleRef[];
}

export interface UserCreateRequest {
  name: string;
  email: string;
  initial_password: string;
  role_ids: string[];
}

export interface UserUpdateRequest {
  name: string;
  email: string;
}

export interface UserAdminPasswordResetRequest {
  new_password: string;
}

export interface UserUpdateRolesRequest {
  role_ids: string[];
}

export type UserList = Paged<UserAdmin>;
