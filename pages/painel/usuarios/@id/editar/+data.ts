
import { toPageRequest } from '@viewmodel/core/page/page-request';
import { loadUserEditPage, type UserEditPageData } from '@viewmodel/users/user-edit-page.vm';
import type { PageContextServer } from 'vike/types';

export type Data = UserEditPageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadUserEditPage(toPageRequest(pageContext));
