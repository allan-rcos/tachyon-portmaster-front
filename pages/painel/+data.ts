
import { toPageRequest } from '@viewmodel/core/page/page-request';
import { loadDashboardPage, type DashboardPageData } from '@viewmodel/metrics/dashboard-page.vm';
import type { PageContextServer } from 'vike/types';

export type Data = DashboardPageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadDashboardPage(toPageRequest(pageContext));
