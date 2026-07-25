
import { toPageRequest } from '@viewmodel/core/page/page-request';
import { loadProductEditPage, type ProductEditPageData } from '@viewmodel/products/product-edit-page.vm';
import type { PageContextServer } from 'vike/types';

export type Data = ProductEditPageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadProductEditPage(toPageRequest(pageContext));
