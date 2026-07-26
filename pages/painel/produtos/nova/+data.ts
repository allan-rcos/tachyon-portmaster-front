import { createProductCreatePageInput } from '@viewmodel/products/product-create-page.vm';
import type { PageContext } from 'vike/types';

import { toPageInput } from '@/pages/pageInput';

export { data };

/**
 * Trabalho de servidor da rota, resolvido ANTES do render.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
async function data(pageContext: PageContext) {
  return toPageInput(pageContext, createProductCreatePageInput);
}
