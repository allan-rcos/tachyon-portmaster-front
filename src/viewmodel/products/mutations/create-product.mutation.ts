import { createProduct as apiCreateProduct } from '@model/products';

import { browserClient } from '../../core/client/api-client';
import type { Product } from '../domain';
import type { ProductFormData } from '../schemas/product.schema';

/**
 * Cadastra um produto no catálogo.
 *
 * @param input Dados já validados pelo schema de produto.
 */
export function createProduct(input: ProductFormData): Promise<Product> {
  return apiCreateProduct(browserClient, input);
}
