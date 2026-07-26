import { ProductListScreen } from '@view/products/screens/ProductListScreen';
import {
  createProductListVM,
  type ProductListPageInput,
} from '@viewmodel/products/product-list-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/**
 * Único ponto de composição da rota: pega o dado que o `+data` resolveu e
 * constrói o ViewModel a partir dele. Nem o ViewModel nem a tela conhecem o
 * Vike — o `+data` é quem faz a tradução.
 */
export default function Page(): JSX.Element {
  const input = useData<ProductListPageInput>();
  return <ProductListScreen vm={createProductListVM(input)} />;
}
