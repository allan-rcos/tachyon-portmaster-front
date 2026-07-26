// ============================================================
//  Rota /painel/usuarios/nova.
//
//  Os perfis disponíveis são buscados no `+data`: o `<select>` chega populado
//  no HTML da primeira requisição, em vez de aparecer vazio e preencher depois.
//
//  Ver `@viewmodel/products/product-list-page.vm` para os dois papéis.
// ============================================================
import { Permission } from '@model/common';
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import { authorize } from '@viewmodel/core/page/authorize';
import type { PageMeta, PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import { listRoles } from '@viewmodel/roles/queries/list-roles.query';

import { userNewMessages, type UserNewText } from './i18n/user-create-page.messages';

/** Permissões que a rota exige. Antes vivia em `+permissions.js`. */
export const USER_CREATE_PERMISSIONS = [Permission.UserCreate] as const;

/** Opção de perfil oferecida no formulário. */
export interface RoleOption {
  /** Id opaco base62 do perfil. */
  id: string;
  /** Nome exibido na opção. */
  name: string;
}

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface UserCreatePageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto da tela, já no locale do request. */
  t: UserNewText;
  /** Perfis disponíveis para vincular ao novo usuário. */
  roles: readonly RoleOption[];
  /** Volta para a listagem — a View não monta rota. */
  listHref: string;
}

/**
 * O trabalho de servidor da rota: autorização, i18n e os perfis do formulário.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem a permissão `UserCreate`.
 */
export async function createUserCreatePageInput(
  request: PageRequest,
): Promise<UserCreatePageInput> {
  const account = await authorize(request, USER_CREATE_PERMISSIONS);
  const t = userNewMessages(resolveLocale(request.headers));
  const roles = await listRoles(request.headers);

  return {
    meta: { title: t.new, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    roles: roles.data.map((role) => ({ id: role.id, name: role.name })),
    listHref: '/painel/usuarios',
  };
}

/** Superfície da criação de usuário. */
export interface UserCreateVM {
  /** Texto da tela. */
  t: UserNewText;
  /** Perfis disponíveis para vincular. */
  roles: readonly RoleOption[];
  /** Volta para a listagem. */
  listHref: string;
}

/**
 * Cria o ViewModel da criação a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createUserCreateVM(input: UserCreatePageInput): UserCreateVM {
  return { t: input.t, roles: input.roles, listHref: input.listHref };
}
