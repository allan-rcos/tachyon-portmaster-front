/**
 * Rota /painel/perfis/nova.
 *
 * A rota não busca nada de leitura: só autoriza e resolve texto. O estado do
 * formulário mora aqui — ver `@viewmodel/products/product-create-page.vm` para
 * o desenho, e `@viewmodel/products/product-list-page.vm` para os dois papéis.
 *
 * @packageDocumentation
 */
import { permissionOptionGroups } from '@viewmodel/core/i18n/labels';
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import { authorize } from '@viewmodel/core/page/authorize';
import type { OptionGroup } from '@viewmodel/core/page/options';
import type { PageMeta, PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import { computed, signal } from 'alien-signals';
import { z } from 'zod';

import { roleNewMessages, type RoleNewText } from './i18n/role-create-page.messages';
import { createRole } from './mutations/create-role.mutation';
import { listPermissions } from './queries/list-permissions.query';
import { createRoleSchema } from './schemas/role.schema';
import type { RoleFormVM } from './vm-contracts';

/**
 * Permissões que a rota exige. Antes vivia em `+permissions.js`.
 *
 * `permission:list` entra pelo mesmo motivo da rota de permissões: a matriz sai
 * do catálogo do backend, e esse endpoint tem guarda própria.
 */
export const ROLE_CREATE_PERMISSIONS = ['role:create', 'permission:list'] as const;

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
 * A matriz deixou de ser constante do módulo: o catálogo de permissões vive no
 * backend, então a rota BUSCA a matriz como busca qualquer outro dado.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem `role:create` + `permission:list`.
 */
export async function createRoleCreatePageInput(
  request: PageRequest,
): Promise<RoleCreatePageInput> {
  const account = await authorize(request, ROLE_CREATE_PERMISSIONS);
  const t = roleNewMessages(resolveLocale(request.headers));
  const catalog = await listPermissions(request.headers);

  return {
    meta: { title: t.new, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    listHref: '/painel/perfis',
    permissionGroups: permissionOptionGroups(catalog),
  };
}

/**
 * Superfície da criação de perfil.
 *
 * O grosso é o {@link RoleFormVM} — o mesmo contrato que a matriz de permissões
 * satisfaz. Aqui só o que a criação estreita.
 */
export interface RoleCreateVM extends RoleFormVM {
  /** Texto da tela — o do formulário, mais o cabeçalho da rota. */
  t: RoleNewText;
  /** `create` decide o rótulo do botão e que o nome é campo, não `<output>`. */
  mode: 'create';
}

/** Valores enquanto se edita. `permissions` é `string[]` porque é exatamente
 *  isso que um slug é — não há mais enum para estreitar. O schema cobra que a
 *  seleção não seja vazia; quem cobra que os slugs existam é o backend. */
interface Draft {
  name: string;
  permissions: string[];
}

/**
 * Cria o ViewModel da criação a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createRoleCreateVM(input: RoleCreatePageInput): RoleCreateVM {
  const schema = createRoleSchema('create', input.t);
  const values = signal<Draft>({ name: '', permissions: [] });
  const nameTouched = signal(false);
  const tried = signal(false);
  const submitting = signal(false);
  const failed = signal(false);

  const problems = computed(() => {
    const result = schema.safeParse(values());
    return result.success ? {} : z.flattenError(result.error).fieldErrors;
  });

  return {
    t: input.t,
    listHref: input.listHref,
    permissionGroups: input.permissionGroups,
    mode: 'create',
    name: () => values().name,
    nameError: () => (nameTouched() ? problems().name?.[0] : undefined),
    hasPermission: (value) => values().permissions.includes(value),
    permissionsError: () => (tried() ? problems().permissions?.[0] : undefined),
    submitting,
    failed,
    setName: (value) => {
      values({ ...values(), name: value });
      failed(false);
    },
    blurName: () => nameTouched(true),
    togglePermission: (value, on) => {
      const set = new Set(values().permissions);
      if (on) set.add(value);
      else set.delete(value);
      values({ ...values(), permissions: [...set] });
      failed(false);
    },
    submit: async () => {
      tried(true);
      const result = schema.safeParse(values());
      if (!result.success) {
        nameTouched(true);
        return false;
      }
      submitting(true);
      failed(false);
      try {
        await createRole(result.data);
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
