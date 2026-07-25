
import { toPageRequest } from '@viewmodel/core/page/page-request';
import { loadProductListPage, type ProductListPageData } from '@viewmodel/products/product-list-page.vm';
import type { PageContextServer } from 'vike/types';

export type Data = ProductListPageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadProductListPage(toPageRequest(pageContext));
