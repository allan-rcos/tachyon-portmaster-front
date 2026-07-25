import { loadLoginPage, type LoginPageData } from '@viewmodel/auth/login-page.vm';
import { toPageRequest } from '@viewmodel/core/page/page-request';
import type { PageContextServer } from 'vike/types';

export type Data = LoginPageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadLoginPage(toPageRequest(pageContext));
