// ============================================================
//  Rota /painel/usuarios/@id/editar.
//
//  Usuário e perfis são buscados em PARALELO no `+data`: são recursos
//  independentes, e serializar as chamadas só somaria latência ao SSR.
//
//  Ver `@viewmodel/products/product-list-page.vm` para os dois papéis.
// ============================================================
import { Permission } from '@model/common';
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import { authorize } from '@viewmodel/core/page/authorize';
import {
  PageNotFoundError,
  routeParam,
  type PageMeta,
  type PageRequest,
} from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import { listRoles } from '@viewmodel/roles/queries/list-roles.query';

import { userEditMessages, type UserEditText } from './i18n/user-edit-page.messages';
import { getUser } from './queries/get-user.query';
import type { RoleOption } from './user-create-page.vm';

/** Permissões que a rota exige. Antes vivia em `+permissions.js`. */
export const USER_EDIT_PERMISSIONS = [Permission.UserGet, Permission.UserUpdate] as const;

/** Valores iniciais do formulário — dado plano, atravessa a serialização. */
export interface UserFormValues {
  /** Nome do usuário. */
  name: string;
  /** E-mail do usuário. */
  email: string;
  /** Ids dos perfis já vinculados. */
  roleIds: readonly string[];
}

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface UserEditPageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto da tela, já no locale do request. */
  t: UserEditText;
  /** Identificador opaco do usuário em edição. */
  id: string;
  /** Nome do usuário, para o cabeçalho e a trilha. */
  userName: string;
  /** Valores que preenchem o formulário. */
  values: UserFormValues;
  /** Perfis disponíveis para vincular. */
  roles: readonly RoleOption[];
  /** Volta para a listagem — a View não monta rota. */
  listHref: string;
}

/**
 * O trabalho de servidor da rota: autorização, i18n, usuário e perfis.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem `UserGet` + `UserUpdate`.
 * @throws {PageNotFoundError} Quando o id não corresponde a um usuário.
 */
export async function createUserEditPageInput(request: PageRequest): Promise<UserEditPageInput> {
  const account = await authorize(request, USER_EDIT_PERMISSIONS);
  const t = userEditMessages(resolveLocale(request.headers));
  const id = routeParam(request, 'id');

  const [user, roles] = await Promise.all([
    getUser(id, request.headers).catch(() => {
      throw new PageNotFoundError(`Usuário não encontrado: ${id}`);
    }),
    listRoles(request.headers),
  ]);

  return {
    meta: { title: `${t.edit} — ${user.name}`, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    id,
    userName: user.name,
    values: {
      name: user.name,
      email: user.email,
      roleIds: user.roles.map((r) => r.id),
    },
    roles: roles.data.map((role) => ({ id: role.id, name: role.name })),
    listHref: '/painel/usuarios',
  };
}

/** Superfície da edição de usuário. */
export interface UserEditVM {
  /** Texto da tela. */
  t: UserEditText;
  /** Identificador opaco do usuário em edição. */
  id: string;
  /** Nome do usuário, para o cabeçalho e a trilha. */
  userName: string;
  /** Valores que preenchem o formulário. */
  values: UserFormValues;
  /** Perfis disponíveis para vincular. */
  roles: readonly RoleOption[];
  /** Volta para a listagem. */
  listHref: string;
}

/**
 * Cria o ViewModel da edição a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createUserEditVM(input: UserEditPageInput): UserEditVM {
  return {
    t: input.t,
    id: input.id,
    userName: input.userName,
    values: input.values,
    roles: input.roles,
    listHref: input.listHref,
  };
}
