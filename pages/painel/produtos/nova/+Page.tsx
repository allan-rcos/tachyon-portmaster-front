import { ProductCreateScreen } from '@view/products/screens/ProductCreateScreen';
import {
  createProductCreateVM,
  type ProductCreatePageInput,
} from '@viewmodel/products/product-create-page.vm';
import { createProductListVM } from '@viewmodel/products/product-list-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/** Único ponto de composição da rota. */
export default function Page(): JSX.Element {
  const input = useData<ProductCreatePageInput>();
  return (
    <ProductCreateScreen
      vm={createProductCreateVM(input)}
      list={createProductListVM(input.background)}
    />
  );
}
