// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================
import type { Product } from '@model/products';

import { productEditMessages, type ProductEditText } from './i18n/product-edit-page.messages';
import { getProduct } from './queries/get-product.query';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';

/** Dados que a rota entrega à View. */
export interface ProductEditPageData {
  id: string;
  product: Product;
  t: ProductEditText;
  title: string;
  description: string;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadProductEditPage(request: PageRequest): Promise<ProductEditPageData> {
  const id = request.routeParams.id;
  const headers = request.headers;
  const t = productEditMessages(resolveLocale(headers));
  const product = await getProduct(id, headers);
  return { id, product, t, title: `${t.edit} ${product.name}`, description: t.subtitle };
}
