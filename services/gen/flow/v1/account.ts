import type { Permission } from './common';

export interface RoleRef {
  id: string;
  name: string;
  user_count: number;
  permissions: Permission[];
}

export interface AccountProfile {
  id: string;
  name: string;
  email: string;
  roles: RoleRef[];
}

export interface AccountUpdateRequest {
  name: string;
  email: string;
}

export interface AccountPasswordChangeRequest {
  current_password: string;
  new_password: string;
}
