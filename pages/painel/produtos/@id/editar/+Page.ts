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
