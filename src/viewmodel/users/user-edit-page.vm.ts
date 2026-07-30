// ============================================================
//  Rota /painel/usuarios/@id/editar.
//
//  Usuário e perfis são buscados em PARALELO no `+data`: são recursos
//  independentes, e serializar as chamadas só somaria latência ao SSR.
//
//  O estado do formulário e o do reset de senha moram aqui — ver
//  `@viewmodel/products/product-create-page.vm` para o desenho, e
//  `@viewmodel/products/product-list-page.vm` para os dois papéis.
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
import { computed, signal } from 'alien-signals';
import { z } from 'zod';

import { userEditMessages, type UserEditText } from './i18n/user-edit-page.messages';
import { deleteUser } from './mutations/delete-user.mutation';
import { resetUserPassword } from './mutations/reset-user-password.mutation';
import { updateUser } from './mutations/update-user.mutation';
import { getUser } from './queries/get-user.query';
import { createPasswordResetSchema, createUserSchema } from './schemas/user.schema';
import type { RoleOption, UserField } from './user-create-page.vm';

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

/** Valores enquanto se digita. Ver `./user-create-page.vm`. */
interface Draft {
  name: string;
  email: string;
  initial_password: string;
  role_ids: string[];
}

const ALL_FIELDS: readonly UserField[] = ['name', 'email', 'initial_password'];

/** Superfície da edição de usuário. */
export interface UserEditVM {
  /** Texto da tela. */
  t: UserEditText;
  /** Identificador opaco do usuário em edição. */
  id: string;
  /** Nome do usuário, para o cabeçalho e a trilha. */
  userName: string;
  /** Perfis disponíveis para vincular. */
  roles: readonly RoleOption[];
  /** Volta para a listagem. Quem navega é a View. */
  listHref: string;
  /** `edit` decide o rótulo do botão e a ausência da senha inicial. */
  mode: 'edit';
  /** Valor atual de um campo de texto. */
  value: (field: UserField) => string;
  /** Erro de um campo, só depois de tocado (ou de uma tentativa de envio). */
  error: (field: UserField) => string | undefined;
  /** Um perfil está vinculado? */
  hasRole: (roleId: string) => boolean;
  /** Erro da seleção de perfis — ver `./user-create-page.vm`. */
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
   * Valida e salva. Nunca rejeita — o erro vira estado.
   *
   * @returns `true` se salvou; a View então navega para `listHref`.
   */
  submit: () => Promise<boolean>;

  // --- Ações administrativas, que a tela mostra ao lado do formulário.

  /** Nova senha digitada no reset. */
  newPassword: () => string;
  /** Erro da nova senha, depois da primeira tentativa de reset. */
  newPasswordError: () => string | undefined;
  /** Um reset está em voo. */
  resetting: () => boolean;
  /** O último reset concluiu — é o que acende a confirmação na tela. */
  resetDone: () => boolean;
  /** Escreve a nova senha. */
  setNewPassword: (value: string) => void;
  /**
   * Redefine a senha do usuário. Nunca rejeita — o erro vira estado.
   *
   * @returns `true` se redefiniu; o campo é limpo junto.
   */
  resetPassword: () => Promise<boolean>;
  /**
   * Exclui o usuário.
   *
   * REJEITA na falha: quem chama é o `ConfirmDialog`, que tem estado de erro
   * próprio.
   */
  remove: () => Promise<void>;
}

/**
 * Cria o ViewModel da edição a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createUserEditVM(input: UserEditPageInput): UserEditVM {
  const schema = createUserSchema('edit', input.t);
  const values = signal<Draft>({
    name: input.values.name,
    email: input.values.email,
    // Declarado pelo schema nos dois modos, mas na edição não é enviado nem
    // exibido — ver `./schemas/user.schema`.
    initial_password: '',
    role_ids: [...input.values.roleIds],
  });
  const touched = signal<ReadonlySet<UserField>>(new Set());
  const tried = signal(false);
  const submitting = signal(false);
  const failed = signal(false);

  const problems = computed(() => {
    const result = schema.safeParse(values());
    return result.success ? {} : z.flattenError(result.error).fieldErrors;
  });

  const resetSchema = createPasswordResetSchema(input.t);
  const newPassword = signal('');
  const resetTried = signal(false);
  const resetting = signal(false);
  const resetDone = signal(false);

  const resetProblem = computed(() => {
    const result = resetSchema.safeParse({ new_password: newPassword() });
    return result.success ? undefined : z.flattenError(result.error).fieldErrors.new_password?.[0];
  });

  return {
    t: input.t,
    id: input.id,
    userName: input.userName,
    roles: input.roles,
    listHref: input.listHref,
    mode: 'edit',
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
        // A senha não trafega na edição — ver `UserUpdateData`.
        await updateUser(input.id, {
          name: result.data.name,
          email: result.data.email,
          role_ids: result.data.role_ids,
        });
        return true;
      } catch {
        failed(true);
        return false;
      } finally {
        submitting(false);
      }
    },

    newPassword,
    newPasswordError: () => (resetTried() ? resetProblem() : undefined),
    resetting,
    resetDone,
    setNewPassword: (value) => {
      newPassword(value);
      resetDone(false);
    },
    resetPassword: async () => {
      resetTried(true);
      const result = resetSchema.safeParse({ new_password: newPassword() });
      if (!result.success) return false;
      resetting(true);
      resetDone(false);
      try {
        await resetUserPassword(input.id, result.data.new_password);
        // Limpar o campo é o que a island fazia com `form.reset()`.
        newPassword('');
        resetTried(false);
        resetDone(true);
        return true;
      } catch {
        return false;
      } finally {
        resetting(false);
      }
    },
    remove: () => deleteUser(input.id),
  };
}
