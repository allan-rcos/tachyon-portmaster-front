
import { toPageRequest } from '@viewmodel/core/page/page-request';
import { loadUserListPage, type UserListPageData } from '@viewmodel/users/user-list-page.vm';
import type { PageContextServer } from 'vike/types';

export type Data = UserListPageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadUserListPage(toPageRequest(pageContext));
