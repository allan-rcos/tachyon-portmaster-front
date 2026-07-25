
import { toPageRequest } from '@viewmodel/core/page/page-request';
import { loadRoleCreatePage, type RoleCreatePageData } from '@viewmodel/roles/role-create-page.vm';
import type { PageContextServer } from 'vike/types';

export type Data = RoleCreatePageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadRoleCreatePage(toPageRequest(pageContext));
