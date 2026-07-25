import { loadAccountPage, type AccountPageData } from '@viewmodel/account/account-page.vm';
import { toPageRequest } from '@viewmodel/core/page/page-request';
import type { PageContextServer } from 'vike/types';


export type Data = AccountPageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadAccountPage(toPageRequest(pageContext));
