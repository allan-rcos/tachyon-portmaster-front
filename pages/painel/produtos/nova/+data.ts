
import { toPageRequest } from '@viewmodel/core/page/page-request';
import { loadProductCreatePage, type ProductCreatePageData } from '@viewmodel/products/product-create-page.vm';
import type { PageContextServer } from 'vike/types';

export type Data = ProductCreatePageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadProductCreatePage(toPageRequest(pageContext));
