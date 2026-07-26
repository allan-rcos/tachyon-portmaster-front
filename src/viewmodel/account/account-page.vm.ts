// ============================================================
//  Rota /painel/conta — o perfil do próprio usuário.
//
//  Só exige sessão: nenhuma permissão. Antes isso era um `+permissions.js` com
//  array vazio, cujo propósito real era IMPEDIR a herança de `MetricsRead` de
//  `/painel` — uma sutileza que só se entendia lendo o guard. Agora a rota
//  declara o que exige, e não há herança a neutralizar.
//
//  Ver `@viewmodel/products/product-list-page.vm` para os dois papéis.
// ============================================================
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import { authorize } from '@viewmodel/core/page/authorize';
import type { PageMeta, PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';

import { accountMessages, type AccountPageText } from './i18n/account-page.messages';
import { getAccount } from './queries/get-account.query';

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
export interface AccountPageVM {
  /** Texto da tela. */
  t: AccountPageViewText;
  /** Identidade do usuário. */
  identity: AccountIdentity;
  /** Perfis vinculados. */
  roles: readonly AccountRoleData[];
}

/**
 * Cria o ViewModel da conta a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createAccountPageVM(input: AccountPageInput): AccountPageVM {
  return { t: input.t, identity: input.identity, roles: input.roles };
}
