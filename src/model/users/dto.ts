import type { RoleRef } from '@model/account/dto';
import type { Paged } from '@model/common/dto';

/** Usuário na visão administrativa, com os perfis vinculados. */
export interface UserAdmin {
  id: string;
  name: string;
  email: string;
  roles: RoleRef[];
}

/** Corpo da criação de usuário, incluindo senha inicial e perfis. */
export interface UserCreateRequest {
  name: string;
  email: string;
  initial_password: string;
  role_ids: string[];
}

/** Corpo da atualização de dados do usuário (não mexe em perfis). */
export interface UserUpdateRequest {
  name: string;
  email: string;
}

/** Corpo do reset administrativo de senha. */
export interface UserAdminPasswordResetRequest {
  new_password: string;
}

/** Corpo da sincronização de perfis do usuário — substitui o conjunto. */
export interface UserUpdateRolesRequest {
  role_ids: string[];
}

/** Página de usuários. */
export type UserList = Paged<UserAdmin>;
