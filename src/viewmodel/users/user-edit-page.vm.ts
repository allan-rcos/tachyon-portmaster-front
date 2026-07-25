// ============================================================
//  ViewModel da rota. Observável: a tela assina os sinais e reage.
//  Roda no navegador (VMContext sem `headers`); passar os headers do request
//  dentro de um `+data.ts` devolve a rota ao SSR sem tocar nada aqui.
// ============================================================
import type { UserAdmin } from './domain';
import { userEditMessages } from './i18n/user-edit-page.messages';
import type { UserEditText } from './i18n/user-edit-page.messages';
import { getUser } from './queries/get-user.query';
import type { RoleOption } from './user-create-page.vm';
import {
  asyncBoundaryMessages,
  type AsyncBoundaryText,
} from '../core/i18n/async-boundary.messages';
import { createAsyncSignal, type AsyncSignal } from '../core/observable/async-signal';
import type { PageMeta } from '../core/page/page-request';
import { contextLocale, routeParam, type VMContext } from '../core/page/vm-context';
import { listRoles } from '../roles/queries/list-roles.query';

/** Usuário em edição, junto dos perfis disponíveis para vincular. */
export interface UserEditData {
  user: UserAdmin;
  roles: RoleOption[];
}

/** Superfície observável da edição de usuário. */
export interface UserEditVM {
  t: UserEditText;
  /** Texto da fronteira de carregamento (erro e nova tentativa). */
  boundary: AsyncBoundaryText;
  /** Identificador opaco do usuário em edição. */
  id: string;
  data: AsyncSignal<UserEditData, []>;
  load: () => Promise<void>;
}

/**
 * Cria o ViewModel da edição de usuário.
 *
 * Usuário e perfis são buscados em paralelo: são recursos independentes, e
 * serializar as chamadas só somaria latência.
 *
 * @param context Contexto de execução; precisa do parâmetro de rota `id`.
 */
export function createUserEditVM(context: VMContext): UserEditVM {
  const t = userEditMessages(contextLocale(context));
  const boundary = asyncBoundaryMessages(contextLocale(context));
  const id = routeParam(context, 'id');
  const data = createAsyncSignal<UserEditData, []>(async () => {
    const [user, roles] = await Promise.all([
      getUser(id, context.headers),
      listRoles(context.headers),
    ]);
    return { user, roles: roles.data.map((role) => ({ id: role.id, name: role.name })) };
  });
  return { t, boundary, id, data, load: () => data.run() };
}

/**
 * Título e descrição da rota, para o `<head>`.
 * @param context Contexto de execução — só o locale importa aqui.
 */
export function userEditMeta(context: VMContext = {}): PageMeta {
  const t = userEditMessages(contextLocale(context));
  return { title: t.edit, description: t.subtitle };
}
