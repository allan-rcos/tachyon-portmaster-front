// ============================================================
//  ViewModel da rota. Observável: a tela assina os sinais e reage.
//  Roda no navegador (VMContext sem `headers`); passar os headers do request
//  dentro de um `+data.ts` devolve a rota ao SSR sem tocar nada aqui.
// ============================================================
import { userNewMessages } from './i18n/user-create-page.messages';
import type { UserNewText } from './i18n/user-create-page.messages';
import {
  asyncBoundaryMessages,
  type AsyncBoundaryText,
} from '../core/i18n/async-boundary.messages';
import { createAsyncSignal, type AsyncSignal } from '../core/observable/async-signal';
import type { PageMeta } from '../core/page/page-request';
import { contextLocale, type VMContext } from '../core/page/vm-context';
import { listRoles } from '../roles/queries/list-roles.query';

/** Opção de perfil oferecida no formulário. */
export interface RoleOption {
  id: string;
  name: string;
}

/** Superfície observável da criação de usuário. */
export interface UserCreateVM {
  t: UserNewText;
  /** Texto da fronteira de carregamento (erro e nova tentativa). */
  boundary: AsyncBoundaryText;
  /** Perfis disponíveis para vincular ao novo usuário. */
  roles: AsyncSignal<RoleOption[], []>;
  load: () => Promise<void>;
}

/**
 * Cria o ViewModel do formulário de novo usuário.
 *
 * @param context Contexto de execução — navegador quando omitido.
 */
export function createUserCreateVM(context: VMContext = {}): UserCreateVM {
  const t = userNewMessages(contextLocale(context));
  const boundary = asyncBoundaryMessages(contextLocale(context));
  const roles = createAsyncSignal<RoleOption[], []>(async () => {
    const res = await listRoles(context.headers);
    return res.data.map((role) => ({ id: role.id, name: role.name }));
  }, []);
  return { t, boundary, roles, load: () => roles.run() };
}

/**
 * Título e descrição da rota, para o `<head>`.
 * @param context Contexto de execução — só o locale importa aqui.
 */
export function userCreateMeta(context: VMContext = {}): PageMeta {
  const t = userNewMessages(contextLocale(context));
  return { title: t.new, description: t.subtitle };
}
