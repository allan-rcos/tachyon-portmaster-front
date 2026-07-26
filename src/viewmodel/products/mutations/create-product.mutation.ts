import { createProduct as apiCreateProduct } from '@model/products';
import type { Product } from '@model/products/dto';
import { browserClient } from '@viewmodel/core/client/api-client';
import type { ProductFormData } from '@viewmodel/products/schemas/product.schema';

/**
 * Cadastra um produto no catálogo.
 *
 * @param input Dados já validados pelo schema de produto.
 */
export function createProduct(input: ProductFormData): Promise<Product> {
  return apiCreateProduct(browserClient, input);
}
