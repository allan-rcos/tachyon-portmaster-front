/**
 * Rota /painel/perfis/@id/permissoes.
 *
 * A API não expõe `GET /roles/{id}`, então o perfil é localizado na listagem —
 * aceitável porque são poucos perfis. Um id que não resolve vira
 * `PageNotFoundError`, e traduzir isso para 404 é papel do `pages/`.
 *
 * O estado da matriz mora aqui — ver `./role-create-page.vm` para o desenho, e
 * `@viewmodel/products/product-list-page.vm` para os dois papéis.
 *
 * @packageDocumentation
 */
import { permissionOptionGroups } from '@viewmodel/core/i18n/labels';
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
import { computed, signal } from 'alien-signals';
import { z } from 'zod';

import {
  rolePermissionsMessages,
  type RolePermissionsText,
} from './i18n/role-permissions-page.messages';
import { updateRolePermissions } from './mutations/update-role-permissions.mutation';
import { listPermissions } from './queries/list-permissions.query';
import { listRoles } from './queries/list-roles.query';
import { createRoleSchema } from './schemas/role.schema';
import type { RoleFormVM } from './vm-contracts';

/** Permissões que a rota exige. Antes vivia em `+permissions.js`. */
export const ROLE_PERMISSIONS_PERMISSIONS = ['role:list', 'role:update_permissions'] as const;

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
 * @throws {ForbiddenError} Sem `role:list` + `role:update_permissions`.
 * @throws {PageNotFoundError} Quando o id não corresponde a um perfil.
 */
export async function createRolePermissionsPageInput(
  request: PageRequest,
): Promise<RolePermissionsPageInput> {
  const account = await authorize(request, ROLE_PERMISSIONS_PERMISSIONS);
  const t = rolePermissionsMessages(resolveLocale(request.headers));
  const id = routeParam(request, 'id');

  // A listagem e o catálogo são independentes: buscar em paralelo tira uma ida
  // ao backend do caminho crítico do SSR.
  const [res, catalog] = await Promise.all([
    listRoles(request.headers),
    listPermissions(request.headers),
  ]);
  const role = res.data.find((candidate) => candidate.id === id);
  if (!role) throw new PageNotFoundError(`Perfil inexistente: ${id}`);

  return {
    meta: { title: `${t.syncPermissions} — ${role.name}`, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    id,
    roleName: role.name,
    granted: role.permissions,
    permissionGroups: permissionOptionGroups(catalog),
    listHref: '/painel/perfis',
  };
}

/**
 * Superfície da matriz de permissões de um perfil.
 *
 * O grosso é o {@link RoleFormVM}, o mesmo que a criação satisfaz — a matriz é
 * a mesma nos dois modos. Aqui só o que esta rota estreita ou acrescenta.
 */
export interface RolePermissionsVM extends RoleFormVM {
  /** Texto da tela — o do formulário, mais o cabeçalho da rota. */
  t: RolePermissionsText;
  /** Identificador opaco do perfil. */
  id: string;
  /** Nome do perfil — só leitura: o `PUT` de permissões não o aceita. */
  roleName: string;
  /** `permissions` decide o rótulo do botão e que o nome vira `<output>`. */
  mode: 'permissions';
}

/**
 * Cria o ViewModel da matriz a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createRolePermissionsVM(input: RolePermissionsPageInput): RolePermissionsVM {
  const schema = createRoleSchema('permissions', input.t);
  const permissions = signal<readonly string[]>([...input.granted]);
  const tried = signal(false);
  const submitting = signal(false);
  const failed = signal(false);

  const problems = computed(() => {
    const result = schema.safeParse({ name: input.roleName, permissions: [...permissions()] });
    return result.success ? {} : z.flattenError(result.error).fieldErrors;
  });

  return {
    t: input.t,
    id: input.id,
    roleName: input.roleName,
    permissionGroups: input.permissionGroups,
    listHref: input.listHref,
    mode: 'permissions',
    name: () => input.roleName,
    nameError: () => undefined,
    hasPermission: (value) => permissions().includes(value),
    permissionsError: () => (tried() ? problems().permissions?.[0] : undefined),
    submitting,
    failed,
    setName: () => {},
    blurName: () => {},
    togglePermission: (value, on) => {
      const set = new Set(permissions());
      if (on) set.add(value);
      else set.delete(value);
      permissions([...set]);
      failed(false);
    },
    submit: async () => {
      tried(true);
      const result = schema.safeParse({ name: input.roleName, permissions: [...permissions()] });
      if (!result.success) return false;
      submitting(true);
      failed(false);
      try {
        // Só as permissões vão no PUT — o nome do perfil não é editável aqui.
        await updateRolePermissions(input.id, result.data.permissions);
        return true;
      } catch {
        failed(true);
        return false;
      } finally {
        submitting(false);
      }
    },
  };
}
