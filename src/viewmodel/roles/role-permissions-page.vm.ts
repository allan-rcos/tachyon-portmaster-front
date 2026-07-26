// ============================================================
//  Rota /painel/perfis/@id/permissoes.
//
//  A API não expõe `GET /roles/{id}`, então o perfil é localizado na listagem —
//  aceitável porque são poucos perfis. Um id que não resolve vira
//  `PageNotFoundError`, e traduzir isso para 404 é papel do `pages/`.
//
//  Ver `@viewmodel/products/product-list-page.vm` para os dois papéis.
// ============================================================
import { Permission } from '@model/common';
import { PERMISSION_OPTION_GROUPS } from '@viewmodel/core/i18n/labels';
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import { authorize } from '@viewmodel/core/page/authorize';
import type { OptionGroup } from '@viewmodel/core/page/options';
import {
  PageNotFoundError,
  routeParam,
  type PageMeta,
  type PageRequest,
} from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';

import {
  rolePermissionsMessages,
  type RolePermissionsText,
} from './i18n/role-permissions-page.messages';
import { listRoles } from './queries/list-roles.query';

/** Permissões que a rota exige. Antes vivia em `+permissions.js`. */
export const ROLE_PERMISSIONS_PERMISSIONS = [
  Permission.RoleList,
  Permission.RoleUpdatePermissions,
] as const;

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface RolePermissionsPageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto da tela, já no locale do request. */
  t: RolePermissionsText;
  /** Identificador opaco do perfil. */
  id: string;
  /** Nome do perfil, para o cabeçalho e a trilha. */
  roleName: string;
  /** Permissões já concedidas ao perfil, para marcar a matriz. */
  granted: readonly string[];
  /** A matriz em si, com os rótulos já resolvidos. */
  permissionGroups: readonly OptionGroup[];
  /** Volta para a listagem — a View não monta rota. */
  listHref: string;
}

/**
 * O trabalho de servidor da rota: autorização, i18n e o perfil.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem `RoleList` + `RoleUpdatePermissions`.
 * @throws {PageNotFoundError} Quando o id não corresponde a um perfil.
 */
export async function createRolePermissionsPageInput(
  request: PageRequest,
): Promise<RolePermissionsPageInput> {
  const account = await authorize(request, ROLE_PERMISSIONS_PERMISSIONS);
  const t = rolePermissionsMessages(resolveLocale(request.headers));
  const id = routeParam(request, 'id');

  const res = await listRoles(request.headers);
  const role = res.data.find((candidate) => candidate.id === id);
  if (!role) throw new PageNotFoundError(`Perfil inexistente: ${id}`);

  return {
    meta: { title: `${t.syncPermissions} — ${role.name}`, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    id,
    roleName: role.name,
    granted: role.permissions,
    permissionGroups: PERMISSION_OPTION_GROUPS,
    listHref: '/painel/perfis',
  };
}

/** Superfície da matriz de permissões de um perfil. */
export interface RolePermissionsVM {
  /** Texto da tela. */
  t: RolePermissionsText;
  /** Identificador opaco do perfil. */
  id: string;
  /** Nome do perfil. */
  roleName: string;
  /** Permissões já concedidas. */
  granted: readonly string[];
  /** A matriz em si. */
  permissionGroups: readonly OptionGroup[];
  /** Volta para a listagem. */
  listHref: string;
}

/**
 * Cria o ViewModel da matriz a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createRolePermissionsVM(input: RolePermissionsPageInput): RolePermissionsVM {
  return {
    t: input.t,
    id: input.id,
    roleName: input.roleName,
    granted: input.granted,
    permissionGroups: input.permissionGroups,
    listHref: input.listHref,
  };
}
