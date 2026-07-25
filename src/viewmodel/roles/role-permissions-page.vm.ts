// ============================================================
//  ViewModel da rota. Observável: a tela assina os sinais e reage.
//  Roda no navegador (VMContext sem `headers`); passar os headers do request
//  dentro de um `+data.ts` devolve a rota ao SSR sem tocar nada aqui.
// ============================================================
import type { Role } from './domain';
import { rolePermissionsMessages } from './i18n/role-permissions-page.messages';
import type { RolePermissionsText } from './i18n/role-permissions-page.messages';
import { listRoles } from './queries/list-roles.query';
import { asyncBoundaryMessages, type AsyncBoundaryText } from '../core/i18n/async-boundary.messages';
import { createAsyncSignal, type AsyncSignal } from '../core/observable/async-signal';
import { PageNotFoundError, type PageMeta } from '../core/page/page-request';
import { contextLocale, routeParam, type VMContext } from '../core/page/vm-context';

/** Superfície observável da matriz de permissões de um perfil. */
export interface RolePermissionsVM {
  t: RolePermissionsText;
  /** Texto da fronteira de carregamento (erro e nova tentativa). */
  boundary: AsyncBoundaryText;
  /** Identificador opaco do perfil. */
  id: string;
  role: AsyncSignal<Role, []>;
  load: () => Promise<void>;
}

/**
 * Cria o ViewModel da tela de permissões de um perfil.
 *
 * A API não expõe `GET /roles/{id}`, então o perfil é localizado na listagem —
 * aceitável porque são poucos perfis. Se o id não existir, sinaliza com
 * `PageNotFoundError`; traduzir isso para 404 é papel de quem compõe a rota.
 *
 * @param context Contexto de execução; precisa do parâmetro de rota `id`.
 */
export function createRolePermissionsVM(context: VMContext): RolePermissionsVM {
  const t = rolePermissionsMessages(contextLocale(context));
  const boundary = asyncBoundaryMessages(contextLocale(context));
  const id = routeParam(context, 'id');
  const role = createAsyncSignal<Role, []>(async () => {
    const res = await listRoles(context.headers);
    const found = res.data.find((candidate) => candidate.id === id);
    if (!found) throw new PageNotFoundError(`Perfil inexistente: ${id}`);
    return found;
  });
  return { t, boundary, id, role, load: () => role.run() };
}

/** Título e descrição da rota, para o `<head>`. */
export function rolePermissionsMeta(context: VMContext = {}): PageMeta {
  const t = rolePermissionsMessages(contextLocale(context));
  return { title: t.syncPermissions, description: t.subtitle };
}
