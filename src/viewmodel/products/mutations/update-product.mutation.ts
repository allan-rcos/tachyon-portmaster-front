import { updateProduct as apiUpdateProduct } from '@model/products';
import type { Product } from '@model/products/dto';
import { browserClient } from '@viewmodel/core/client/api-client';
import type { ProductFormData } from '@viewmodel/products/schemas/product.schema';

/**
 * Atualiza um produto existente.
 *
 * @param id    Identificador opaco do produto.
 * @param input Dados já validados pelo schema de produto.
 */
export function updateProduct(id: string, input: ProductFormData): Promise<Product> {
  return apiUpdateProduct(browserClient, id, input);
}
