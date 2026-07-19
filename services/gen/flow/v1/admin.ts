import type { Permission, Paged } from './common';
import type { RoleRef } from './account';

// ---- Usuários (ADMIN) ----
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

// ---- Roles (ADMIN) ----
export interface Role {
  id: string;
  name: string;
  user_count: number;
  permissions: Permission[];
}

export interface RoleCreateRequest {
  name: string;
  permissions: Permission[];
}

export interface RoleUpdatePermissionsRequest {
  permissions: Permission[];
}

export type RoleList = Paged<Role>;
