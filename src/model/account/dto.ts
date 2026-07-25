import type { Permission } from '../common/dto';

/** Perfil como aparece embutido em um usuário ou conta. */
export interface RoleRef {
  id: string;
  name: string;
  user_count: number;
  permissions: Permission[];
}

/** Perfil do usuário autenticado; a união de suas permissões define o acesso. */
export interface AccountProfile {
  id: string;
  name: string;
  email: string;
  roles: RoleRef[];
}

/** Corpo da atualização dos próprios dados. */
export interface AccountUpdateRequest {
  name: string;
  email: string;
}

/** Corpo da troca da própria senha — exige a senha atual. */
export interface AccountPasswordChangeRequest {
  current_password: string;
  new_password: string;
}
