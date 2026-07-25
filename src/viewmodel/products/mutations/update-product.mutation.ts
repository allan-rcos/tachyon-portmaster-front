import { updateProduct as apiUpdateProduct } from '@model/products';

import { browserClient } from '../../core/client/api-client';
import type { Product } from '../domain';
import type { ProductFormData } from '../schemas/product.schema';

/**
 * Atualiza um produto existente.
 *
 * @param id    Identificador opaco do produto.
 * @param input Dados já validados pelo schema de produto.
 */
export function updateProduct(id: string, input: ProductFormData): Promise<Product> {
  return apiUpdateProduct(browserClient, id, input);
}
