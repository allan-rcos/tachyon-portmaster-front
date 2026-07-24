import { getProduct as apiGetProduct } from 'tachyon-portmaster-sdk/products';

import { serverClient, type IncomingHeaders } from '@/features/core/api/client';

export function getProduct(id: string, headers: IncomingHeaders) {
  return apiGetProduct(serverClient(headers), id);
}
