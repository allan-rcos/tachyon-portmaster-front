import { ProductCreateScreen } from '@view/products/screens/ProductCreateScreen';
import {
  createProductCreateVM,
  type ProductCreatePageInput,
} from '@viewmodel/products/product-create-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createProductCreateVM(pageContext.data as ProductCreatePageInput);
  return () => ProductCreateScreen({ vm });
}
