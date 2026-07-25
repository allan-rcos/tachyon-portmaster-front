import { getProduct as apiGetProduct } from '@model/products';
import { serverClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

export function getProduct(id: string, headers: IncomingHeaders) {
  return apiGetProduct(serverClient(headers), id);
}
