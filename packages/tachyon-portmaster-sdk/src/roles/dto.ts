import type { Permission, Paged } from '../common/dto';

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
