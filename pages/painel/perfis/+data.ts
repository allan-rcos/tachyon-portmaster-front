
import { toPageRequest } from '@viewmodel/core/page/page-request';
import { loadRoleListPage, type RoleListPageData } from '@viewmodel/roles/role-list-page.vm';
import type { PageContextServer } from 'vike/types';

export type Data = RoleListPageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadRoleListPage(toPageRequest(pageContext));
