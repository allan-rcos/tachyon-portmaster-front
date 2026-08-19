import { ProductEditScreen } from '@view/products/screens/ProductEditScreen';
import {
  createProductEditVM,
  type ProductEditPageInput,
} from '@viewmodel/products/product-edit-page.vm';
import { createProductListVM } from '@viewmodel/products/product-list-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/** Único ponto de composição da rota. */
export default function Page(): JSX.Element {
  const input = useData<ProductEditPageInput>();
  return (
    <ProductEditScreen
      vm={createProductEditVM(input)}
      list={createProductListVM(input.background)}
    />
  );
}
