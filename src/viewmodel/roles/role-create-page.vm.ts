// ============================================================
//  Rota /painel/perfis/nova.
//
//  A rota não busca nada: só autoriza e resolve texto. Ver
//  `@viewmodel/products/product-list-page.vm` para os dois papéis.
// ============================================================
import { Permission } from '@model/common';
import { PERMISSION_OPTION_GROUPS } from '@viewmodel/core/i18n/labels';
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import { authorize } from '@viewmodel/core/page/authorize';
import type { OptionGroup } from '@viewmodel/core/page/options';
import type { PageMeta, PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';

import { roleNewMessages, type RoleNewText } from './i18n/role-create-page.messages';

/** Permissões que a rota exige. Antes vivia em `+permissions.js`. */
export const ROLE_CREATE_PERMISSIONS = [Permission.RoleCreate] as const;

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface RoleCreatePageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto da tela, já no locale do request. */
  t: RoleNewText;
  /** Volta para a listagem — a View não monta rota. */
  listHref: string;
  /** A matriz de permissões, com os rótulos já resolvidos. */
  permissionGroups: readonly OptionGroup[];
}

/**
 * O trabalho de servidor da rota: autorização e i18n.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem a permissão `RoleCreate`.
 */
export async function createRoleCreatePageInput(
  request: PageRequest,
): Promise<RoleCreatePageInput> {
  const account = await authorize(request, ROLE_CREATE_PERMISSIONS);
  const t = roleNewMessages(resolveLocale(request.headers));

  return {
    meta: { title: t.new, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    listHref: '/painel/perfis',
    permissionGroups: PERMISSION_OPTION_GROUPS,
  };
}

/** Superfície do formulário de criação. */
export interface RoleCreateVM {
  /** Texto da tela. */
  t: RoleNewText;
  /** Volta para a listagem. */
  listHref: string;
  /** A matriz de permissões. */
  permissionGroups: readonly OptionGroup[];
}

/**
 * Cria o ViewModel da criação a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createRoleCreateVM(input: RoleCreatePageInput): RoleCreateVM {
  return {
    t: input.t,
    listHref: input.listHref,
    permissionGroups: input.permissionGroups,
  };
}
