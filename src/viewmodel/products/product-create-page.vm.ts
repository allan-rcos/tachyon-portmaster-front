// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================

import { productNewMessages, type ProductNewText } from './i18n/product-create-page.messages';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';

/** Dados que a rota entrega à View. */
export interface ProductCreatePageData {
  t: ProductNewText;
  title: string;
  description: string;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadProductCreatePage(request: PageRequest): Promise<ProductCreatePageData> {
  const t = productNewMessages(resolveLocale(request.headers));
  return { t, title: t.new, description: t.subtitle };
}
