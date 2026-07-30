/**
 * Composição de `/painel/produtos` — Listagem de produtos.
 *
 * Único ponto onde View e ViewModel se encontram para esta rota: constrói o VM a
 * partir do `pageContext.data` e devolve a tela. Sem markup, sem CSS, sem lógica.
 *
 * @packageDocumentation
 */
import { ProductListScreen } from '@view/products/screens/ProductListScreen';
import {
  createProductListVM,
  type ProductListPageInput,
} from '@viewmodel/products/product-list-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota: pega o dado que o `+data` resolveu e
 * constrói o ViewModel a partir dele. Nem o ViewModel nem a tela conhecem o
 * Vike — o `+data` é quem faz a tradução.
 *
 * A fábrica roda UMA vez por página; o thunk que ela devolve é o que o laço de
 * render reavalia. É isso que faz as páginas já carregadas do cursor
 * sobreviverem aos re-renders.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createProductListVM(pageContext.data as ProductListPageInput);
  return () => ProductListScreen({ vm });
}
