import { deleteProduct as apiDeleteProduct } from '@model/products';

import { browserClient } from '../../core/client/api-client';

/**
 * Remove um produto do catálogo.
 *
 * @param id Identificador opaco do produto.
 */
export async function deleteProduct(id: string): Promise<void> {
  await apiDeleteProduct(browserClient, id);
}
