import { createProductListPageInput } from '@viewmodel/products/product-list-page.vm';
import type { PageContext } from 'vike/types';

import { toPageInput } from '@/pages/pageInput';

export { data };

/**
 * Trabalho de servidor da rota, resolvido ANTES do render — é o que faz o HTML
 * da primeira requisição já sair com os produtos dentro.
 *
 * Este arquivo é a única peça da rota que conhece o Vike: ele traduz o
 * `PageContext` para o `PageRequest` neutro e converte os erros de autorização
 * do ViewModel nas abortagens do framework.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
async function data(pageContext: PageContext) {
  return toPageInput(pageContext, createProductListPageInput);
}
