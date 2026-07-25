import { getProduct as apiGetProduct } from '@model/products';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

export function getProduct(id: string, headers?: IncomingHeaders) {
  return apiGetProduct(resolveClient(headers), id);
}
