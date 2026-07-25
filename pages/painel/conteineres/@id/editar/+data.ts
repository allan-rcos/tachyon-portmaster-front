import { loadContainerEditPage, type ContainerEditPageData } from '@viewmodel/containers/container-edit-page.vm';
import { toPageRequest } from '@viewmodel/core/page/page-request';
import type { PageContextServer } from 'vike/types';


export type Data = ContainerEditPageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadContainerEditPage(toPageRequest(pageContext));
