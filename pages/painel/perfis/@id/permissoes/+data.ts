import { PageNotFoundError, toPageRequest } from '@viewmodel/core/page/page-request';
import {
  loadRolePermissionsPage,
  type RolePermissionsPageData,
} from '@viewmodel/roles/role-permissions-page.vm';
import { render } from 'vike/abort';
import type { PageContextServer } from 'vike/types';


export type Data = RolePermissionsPageData;

/**
 * Casca do Vike: adapta o PageContext, delega ao ViewModel e traduz o erro de
 * domínio para a resposta HTTP. O ViewModel não conhece `render`/404 — quem
 * decide como um recurso ausente vira status é o composition root.
 */
export const data = async (pageContext: PageContextServer): Promise<Data> => {
  try {
    return await loadRolePermissionsPage(toPageRequest(pageContext));
  } catch (error) {
    if (error instanceof PageNotFoundError) throw render(404);
    throw error;
  }
};
