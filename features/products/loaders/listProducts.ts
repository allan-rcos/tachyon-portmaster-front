import { listProducts as apiListProducts } from 'tachyon-portmaster-sdk/products';

import { serverClient, type IncomingHeaders } from '@/features/core/api/client';

export function listProducts(headers: IncomingHeaders, query?: URLSearchParams) {
  const params: Record<string, string> = { limit: query?.get('limit') ?? '50' };
  const cursor = query?.get('cursor');
  if (cursor) params.cursor = cursor;
  const search = query?.get('search');
  if (search) params.search = search;
  return apiListProducts(serverClient(headers), params);
}
