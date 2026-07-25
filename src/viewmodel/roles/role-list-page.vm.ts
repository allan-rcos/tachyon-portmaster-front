// ============================================================
//  ViewModel da rota. Observável: a tela assina os sinais e reage.
//  Roda no navegador (VMContext sem `headers`); passar os headers do request
//  dentro de um `+data.ts` devolve a rota ao SSR sem tocar nada aqui.
// ============================================================
import type { RoleList } from './domain';
import { rolesListMessages } from './i18n/role-list-page.messages';
import type { RoleListText } from './i18n/text-contracts';
import { listRoles } from './queries/list-roles.query';
import { asyncBoundaryMessages, type AsyncBoundaryText } from '../core/i18n/async-boundary.messages';
import { createAsyncSignal, type AsyncSignal } from '../core/observable/async-signal';
import type { PageMeta } from '../core/page/page-request';
import { contextLocale, contextParams, type VMContext } from '../core/page/vm-context';

/** Superfície observável da listagem de perfis. */
export interface RoleListVM {
  t: RoleListText;
  /** Texto da fronteira de carregamento (erro e nova tentativa). */
  boundary: AsyncBoundaryText;
  roles: AsyncSignal<RoleList, []>;
  load: () => Promise<void>;
}

/**
 * Cria o ViewModel da listagem de perfis.
 *
 * @param context Contexto de execução — navegador quando omitido.
 */
export function createRoleListVM(context: VMContext = {}): RoleListVM {
  const t = rolesListMessages(contextLocale(context));
  const boundary = asyncBoundaryMessages(contextLocale(context));
  const params = contextParams(context);
  const roles = createAsyncSignal<RoleList, []>(() => listRoles(context.headers, params));
  return { t, boundary, roles, load: () => roles.run() };
}

/**
 * Título e descrição da rota, para o `<head>`.
 * @param context Contexto de execução — só o locale importa aqui.
 */
export function roleListMeta(context: VMContext = {}): PageMeta {
  const t = rolesListMessages(contextLocale(context));
  return { title: t.title, description: t.subtitle };
}
