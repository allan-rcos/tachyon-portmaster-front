import { loadContainerDetailPage, type ContainerDetailPageData } from '@viewmodel/containers/container-detail-page.vm';
import { toPageRequest } from '@viewmodel/core/page/page-request';
import type { PageContextServer } from 'vike/types';


export type Data = ContainerDetailPageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadContainerDetailPage(toPageRequest(pageContext));
