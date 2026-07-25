import { loadErrorPage, type ErrorPageData } from '@viewmodel/core/error-page.vm';
import { toPageRequest } from '@viewmodel/core/page/page-request';
import type { PageContextServer } from 'vike/types';

export type Data = ErrorPageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Data =>
  loadErrorPage(toPageRequest(pageContext));
