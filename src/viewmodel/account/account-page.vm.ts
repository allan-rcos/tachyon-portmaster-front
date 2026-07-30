// ============================================================
//  Rota /painel/conta — o perfil do próprio usuário.
//
//  Só exige sessão: nenhuma permissão. Antes isso era um `+permissions.js` com
//  array vazio, cujo propósito real era IMPEDIR a herança de `MetricsRead` de
//  `/painel` — uma sutileza que só se entendia lendo o guard. Agora a rota
//  declara o que exige, e não há herança a neutralizar.
//
//  A tela tem DOIS formulários independentes (dados e senha), e o estado dos
//  dois mora aqui — ver `@viewmodel/products/product-create-page.vm` para o
//  desenho, e `@viewmodel/products/product-list-page.vm` para os dois papéis.
// ============================================================
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import { authorize } from '@viewmodel/core/page/authorize';
import type { PageMeta, PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import { computed, signal } from 'alien-signals';
import { z } from 'zod';

import { accountMessages, type AccountPageText } from './i18n/account-page.messages';
import { changeAccountPassword } from './mutations/change-account-password.mutation';
import { updateAccountProfile } from './mutations/update-account-profile.mutation';
import { getAccount } from './queries/get-account.query';
import { createAccountSchema, createPasswordChangeSchema } from './schemas/account.schema';

/**
 * O texto que atravessa para a View.
 *
 * `permissionsCount` fica de fora de propósito: é uma FUNÇÃO, e o `PageInput`
 * precisa sobreviver ao `@brillout/json-serializer` do Vike. Ela é chamada aqui
 * no servidor e o resultado viaja como string, em `AccountRoleData`.
 */
export type AccountPageViewText = Omit<AccountPageText, 'permissionsCount'>;

/** Um perfil vinculado ao usuário, pronto para desenhar. */
export interface AccountRoleData {
  /** Id opaco, usado como chave de lista. */
  id: string;
  /** Nome do perfil. */
  name: string;
  /** Contagem de permissões já interpolada (ex.: `'12 permissões'`). */
  permissionsLabel: string;
}

/** Identidade do usuário autenticado, em formato de apresentação. */
export interface AccountIdentity {
  /** Nome do usuário. */
  name: string;
  /** E-mail do usuário. */
  email: string;
}

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface AccountPageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto da tela, já no locale do request. */
  t: AccountPageViewText;
  /** Identidade do usuário. */
  identity: AccountIdentity;
  /** Perfis vinculados, com a contagem de permissões já escrita. */
  roles: readonly AccountRoleData[];
}

/**
 * O trabalho de servidor da rota: sessão, i18n e o perfil próprio.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 */
export async function createAccountPageInput(request: PageRequest): Promise<AccountPageInput> {
  const account = await authorize(request);
  const { permissionsCount, ...t } = accountMessages(resolveLocale(request.headers));
  const profile = await getAccount(request.headers);

  return {
    meta: { title: t.title, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    identity: { name: profile.name, email: profile.email },
    roles: profile.roles.map((role) => ({
      id: role.id,
      name: role.name,
      permissionsLabel: permissionsCount(role.permissions.length),
    })),
  };
}

/** Superfície da tela de conta. */
/** Campos do formulário de dados da conta. */
export type ProfileField = 'name' | 'email';

/** Campos do formulário de troca de senha. */
export type PasswordField = 'current_password' | 'new_password';

const ALL_PROFILE_FIELDS: readonly ProfileField[] = ['name', 'email'];
const ALL_PASSWORD_FIELDS: readonly PasswordField[] = ['current_password', 'new_password'];

/**
 *
 */
export interface AccountPageVM {
  /** Texto da tela. */
  t: AccountPageViewText;
  /** Identidade do usuário. */
  identity: AccountIdentity;
  /** Perfis vinculados. */
  roles: readonly AccountRoleData[];

  // --- Formulário de dados da conta. Nasce preenchido com a identidade.

  /** Valor atual de um campo de perfil. */
  profileValue: (field: ProfileField) => string;
  /** Erro de um campo de perfil, só depois de tocado. */
  profileError: (field: ProfileField) => string | undefined;
  /** Uma gravação de perfil está em voo. */
  savingProfile: () => boolean;
  /** A última gravação de perfil falhou na API. */
  profileFailed: () => boolean;
  /** Escreve um campo de perfil. */
  setProfile: (field: ProfileField, value: string) => void;
  /** Marca um campo de perfil como tocado. */
  blurProfile: (field: ProfileField) => void;
  /**
   * Valida e grava os próprios dados. Nunca rejeita — o erro vira estado.
   *
   * @returns `true` se gravou; a View então recarrega, porque o nome aparece
   *          também no rodapé da barra lateral.
   */
  saveProfile: () => Promise<boolean>;

  // --- Formulário de troca de senha, independente do de cima.

  /** Valor atual de um campo de senha. */
  passwordValue: (field: PasswordField) => string;
  /** Erro de um campo de senha, só depois de tocado. */
  passwordError: (field: PasswordField) => string | undefined;
  /** Uma troca de senha está em voo. */
  changingPassword: () => boolean;
  /** A última troca de senha falhou na API. */
  passwordFailed: () => boolean;
  /** A última troca de senha concluiu — acende a confirmação na tela. */
  passwordChanged: () => boolean;
  /** Escreve um campo de senha. */
  setPassword: (field: PasswordField, value: string) => void;
  /** Marca um campo de senha como tocado. */
  blurPassword: (field: PasswordField) => void;
  /**
   * Valida e troca a própria senha. Nunca rejeita — o erro vira estado.
   *
   * @returns `true` se trocou; os campos são limpos junto.
   */
  changePassword: () => Promise<boolean>;
}

/**
 * Cria o ViewModel da conta a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createAccountPageVM(input: AccountPageInput): AccountPageVM {
  const profileSchema = createAccountSchema(input.t);
  const profile = signal({ name: input.identity.name, email: input.identity.email });
  const profileTouched = signal<ReadonlySet<ProfileField>>(new Set());
  const savingProfile = signal(false);
  const profileFailed = signal(false);

  const profileProblems = computed(() => {
    const result = profileSchema.safeParse(profile());
    return result.success ? {} : z.flattenError(result.error).fieldErrors;
  });

  const passwordSchema = createPasswordChangeSchema(input.t);
  const password = signal({ current_password: '', new_password: '' });
  const passwordTouched = signal<ReadonlySet<PasswordField>>(new Set());
  const changingPassword = signal(false);
  const passwordFailed = signal(false);
  const passwordChanged = signal(false);

  const passwordProblems = computed(() => {
    const result = passwordSchema.safeParse(password());
    return result.success ? {} : z.flattenError(result.error).fieldErrors;
  });

  return {
    t: input.t,
    identity: input.identity,
    roles: input.roles,

    profileValue: (field) => profile()[field],
    profileError: (field) =>
      profileTouched().has(field) ? profileProblems()[field]?.[0] : undefined,
    savingProfile,
    profileFailed,
    setProfile: (field, value) => {
      profile({ ...profile(), [field]: value });
      profileFailed(false);
    },
    blurProfile: (field) => profileTouched(new Set(profileTouched()).add(field)),
    saveProfile: async () => {
      const result = profileSchema.safeParse(profile());
      if (!result.success) {
        profileTouched(new Set(ALL_PROFILE_FIELDS));
        return false;
      }
      savingProfile(true);
      profileFailed(false);
      try {
        await updateAccountProfile(result.data);
        return true;
      } catch {
        profileFailed(true);
        return false;
      } finally {
        savingProfile(false);
      }
    },

    passwordValue: (field) => password()[field],
    passwordError: (field) =>
      passwordTouched().has(field) ? passwordProblems()[field]?.[0] : undefined,
    changingPassword,
    passwordFailed,
    passwordChanged,
    setPassword: (field, value) => {
      password({ ...password(), [field]: value });
      passwordFailed(false);
      passwordChanged(false);
    },
    blurPassword: (field) => passwordTouched(new Set(passwordTouched()).add(field)),
    changePassword: async () => {
      const result = passwordSchema.safeParse(password());
      if (!result.success) {
        passwordTouched(new Set(ALL_PASSWORD_FIELDS));
        return false;
      }
      changingPassword(true);
      passwordFailed(false);
      try {
        await changeAccountPassword(result.data);
        // Limpar os campos é o que a island fazia com `form.reset()`.
        password({ current_password: '', new_password: '' });
        passwordTouched(new Set());
        passwordChanged(true);
        return true;
      } catch {
        passwordFailed(true);
        return false;
      } finally {
        changingPassword(false);
      }
    },
  };
}
