/**
 * Composição de `/painel/produtos/@id/editar` — Edição de produto.
 *
 * Único ponto onde View e ViewModel se encontram para esta rota: constrói o VM a
 * partir do `pageContext.data` e devolve a tela. Sem markup, sem CSS, sem lógica.
 *
 * @packageDocumentation
 */
import { ProductEditScreen } from '@view/products/screens/ProductEditScreen';
import {
  createProductEditVM,
  type ProductEditPageInput,
} from '@viewmodel/products/product-edit-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createProductEditVM(pageContext.data as ProductEditPageInput);
  return () => ProductEditScreen({ vm });
}
