// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================
import type { Product } from '@model/products';

import { productsListMessages } from './i18n/product-list-page.messages';
import type { ProductListText } from './i18n/text-contracts';
import { listProducts } from './queries/list-products.query';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';
import { searchParams } from '../core/page/page-request';

/** Dados que a rota entrega à View. */
export interface ProductListPageData {
  items: Product[];
  total: number;
  t: ProductListText;
  title: string;
  description: string;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadProductListPage(request: PageRequest): Promise<ProductListPageData> {
  const headers = request.headers;
  const t = productsListMessages(resolveLocale(headers));
  const query = searchParams(request);
  const res = await listProducts(headers, query);
  return { items: res.data, total: res.total, t, title: t.title, description: t.subtitle };
}
