// ============================================================
//  Rota /painel/usuarios/nova.
//
//  Os perfis disponíveis são buscados no `+data`: o `<select>` chega populado
//  no HTML da primeira requisição, em vez de aparecer vazio e preencher depois.
//
//  O estado do formulário mora aqui — ver
//  `@viewmodel/products/product-create-page.vm` para o desenho, e
//  `@viewmodel/products/product-list-page.vm` para os dois papéis.
// ============================================================
import { Permission } from '@model/common';
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import { authorize } from '@viewmodel/core/page/authorize';
import type { PageMeta, PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import { listRoles } from '@viewmodel/roles/queries/list-roles.query';
import { computed, signal } from 'alien-signals';
import { z } from 'zod';

import { userNewMessages, type UserNewText } from './i18n/user-create-page.messages';
import { createUser } from './mutations/create-user.mutation';
import { createUserSchema } from './schemas/user.schema';

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

/** Campos de texto do formulário de usuário. Os perfis têm API própria. */
export type UserField = 'name' | 'email' | 'initial_password';

/** Valores enquanto se digita. Ver `@viewmodel/products/product-create-page.vm`. */
interface Draft {
  name: string;
  email: string;
  initial_password: string;
  role_ids: string[];
}

const ALL_FIELDS: readonly UserField[] = ['name', 'email', 'initial_password'];

/** Superfície da criação de usuário. */
export interface UserCreateVM {
  /** Texto da tela. */
  t: UserNewText;
  /** Perfis disponíveis para vincular. */
  roles: readonly RoleOption[];
  /** Volta para a listagem. Quem navega é a View. */
  listHref: string;
  /** `create` decide o rótulo do botão e a presença da senha inicial. */
  mode: 'create';
  /** Valor atual de um campo de texto. */
  value: (field: UserField) => string;
  /** Erro de um campo, só depois de tocado (ou de uma tentativa de envio). */
  error: (field: UserField) => string | undefined;
  /** Um perfil está vinculado? */
  hasRole: (roleId: string) => boolean;
  /**
   * Erro da seleção de perfis.
   *
   * Separado dos campos de texto porque não há "tocar" um grupo de caixas: o
   * erro aparece depois da primeira tentativa de envio.
   */
  rolesError: () => string | undefined;
  /** Uma submissão está em voo. */
  submitting: () => boolean;
  /** A última tentativa falhou na API. */
  failed: () => boolean;
  /** Escreve um campo de texto. */
  set: (field: UserField, value: string) => void;
  /** Marca um campo como tocado, liberando o erro dele. */
  blur: (field: UserField) => void;
  /** Liga ou desliga o vínculo com um perfil. */
  toggleRole: (roleId: string, on: boolean) => void;
  /**
   * Valida e cria. Nunca rejeita — o erro vira estado.
   *
   * @returns `true` se criou; a View então navega para `listHref`.
   */
  submit: () => Promise<boolean>;
}

/**
 * Cria o ViewModel da criação a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createUserCreateVM(input: UserCreatePageInput): UserCreateVM {
  const schema = createUserSchema('create', input.t);
  const values = signal<Draft>({ name: '', email: '', initial_password: '', role_ids: [] });
  const touched = signal<ReadonlySet<UserField>>(new Set());
  const tried = signal(false);
  const submitting = signal(false);
  const failed = signal(false);

  const problems = computed(() => {
    const result = schema.safeParse(values());
    return result.success ? {} : z.flattenError(result.error).fieldErrors;
  });

  return {
    t: input.t,
    roles: input.roles,
    listHref: input.listHref,
    mode: 'create',
    value: (field) => values()[field],
    error: (field) => (touched().has(field) ? problems()[field]?.[0] : undefined),
    hasRole: (roleId) => values().role_ids.includes(roleId),
    rolesError: () => (tried() ? problems().role_ids?.[0] : undefined),
    submitting,
    failed,
    set: (field, value) => {
      values({ ...values(), [field]: value });
      failed(false);
    },
    blur: (field) => touched(new Set(touched()).add(field)),
    toggleRole: (roleId, on) => {
      const set = new Set(values().role_ids);
      if (on) set.add(roleId);
      else set.delete(roleId);
      values({ ...values(), role_ids: [...set] });
      failed(false);
    },
    submit: async () => {
      tried(true);
      const result = schema.safeParse(values());
      if (!result.success) {
        touched(new Set(ALL_FIELDS));
        return false;
      }
      submitting(true);
      failed(false);
      try {
        await createUser(result.data);
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
