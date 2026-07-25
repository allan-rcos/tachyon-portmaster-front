import { loadContainerListPage, type ContainerListPageData } from '@viewmodel/containers/container-list-page.vm';
import { toPageRequest } from '@viewmodel/core/page/page-request';
import type { PageContextServer } from 'vike/types';


export type Data = ContainerListPageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadContainerListPage(toPageRequest(pageContext));
