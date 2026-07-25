import { loadContainerCreatePage, type ContainerCreatePageData } from '@viewmodel/containers/container-create-page.vm';
import { toPageRequest } from '@viewmodel/core/page/page-request';
import type { PageContextServer } from 'vike/types';


export type Data = ContainerCreatePageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadContainerCreatePage(toPageRequest(pageContext));
