import { ProductList } from '@view/products/components/ProductList';
import type { ProductListVM } from '@viewmodel/products/product-list-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela de listagem de produtos. */
export interface ProductListScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: ProductListVM;
}

/**
 * Tela da listagem de produtos.
 *
 * Stateless: não guarda estado, não formata e não busca nada — a primeira
 * página já chegou pronta pelo `+data` e o resto vem dos handlers do ViewModel.
 * Não há mais `AsyncBoundary` de carregamento inicial porque não há mais
 * carregamento inicial: quando esta tela renderiza, o dado já existe.
 *
 * @param props.vm ViewModel da rota.
 */
export function ProductListScreen(props: ProductListScreenProps): JSX.Element {
  return <ProductList vm={props.vm} />;
}
