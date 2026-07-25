
import { toPageRequest } from '@viewmodel/core/page/page-request';
import { loadUserCreatePage, type UserCreatePageData } from '@viewmodel/users/user-create-page.vm';
import type { PageContextServer } from 'vike/types';

export type Data = UserCreatePageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadUserCreatePage(toPageRequest(pageContext));
