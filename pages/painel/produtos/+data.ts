/**
 * Trabalho de servidor de `/painel/produtos`, resolvido ANTES do render.
 *
 * Roda nos dois lados: no servidor o HTML da primeira requisição já sai completo,
 * no cliente a mesma função vai no bundle e a navegação resolve sem requisição de
 * página. Adapta o `PageContext` do Vike ao
 * {@link "pages/pageInput" | contrato neutro} e delega ao `createXPageInput`.
 *
 * @packageDocumentation
 */
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
