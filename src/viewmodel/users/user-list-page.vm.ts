// ============================================================
//  ViewModel da rota. Observável: a tela assina os sinais e reage.
//  Roda no navegador (VMContext sem `headers`); passar os headers do request
//  dentro de um `+data.ts` devolve a rota ao SSR sem tocar nada aqui.
// ============================================================
import type { UserList } from './domain';
import type { UserListText } from './i18n/text-contracts';
import { usersListMessages } from './i18n/user-list-page.messages';
import { listUsers } from './queries/list-users.query';
import {
  asyncBoundaryMessages,
  type AsyncBoundaryText,
} from '../core/i18n/async-boundary.messages';
import { createAsyncSignal, type AsyncSignal } from '../core/observable/async-signal';
import type { PageMeta } from '../core/page/page-request';
import { contextLocale, contextParams, type VMContext } from '../core/page/vm-context';

/** Superfície observável da listagem de usuários. */
export interface UserListVM {
  t: UserListText;
  /** Texto da fronteira de carregamento (erro e nova tentativa). */
  boundary: AsyncBoundaryText;
  users: AsyncSignal<UserList, []>;
  load: () => Promise<void>;
}

/**
 * Cria o ViewModel da listagem de usuários.
 *
 * @param context Contexto de execução — navegador quando omitido.
 */
export function createUserListVM(context: VMContext = {}): UserListVM {
  const t = usersListMessages(contextLocale(context));
  const boundary = asyncBoundaryMessages(contextLocale(context));
  const params = contextParams(context);
  const users = createAsyncSignal<UserList, []>(() => listUsers(context.headers, params));
  return { t, boundary, users, load: () => users.run() };
}

/**
 * Título e descrição da rota, para o `<head>`.
 * @param context Contexto de execução — só o locale importa aqui.
 */
export function userListMeta(context: VMContext = {}): PageMeta {
  const t = usersListMessages(contextLocale(context));
  return { title: t.title, description: t.subtitle };
}
