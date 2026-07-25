import type { Permission, Paged } from '../common/dto';

/** Perfil de acesso: um nome e o conjunto de permissões que concede. */
export interface Role {
  id: string;
  name: string;
  user_count: number;
  permissions: Permission[];
}

/** Corpo da criação de perfil, com as permissões iniciais. */
export interface RoleCreateRequest {
  name: string;
  permissions: Permission[];
}

/** Corpo da sincronização de permissões — substitui o conjunto inteiro. */
export interface RoleUpdatePermissionsRequest {
  permissions: Permission[];
}

/** Página de perfis. */
export type RoleList = Paged<Role>;
