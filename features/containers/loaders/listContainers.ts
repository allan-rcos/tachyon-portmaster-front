import { listContainers as apiListContainers } from 'tachyon-portmaster-sdk/containers';

import { serverClient, type IncomingHeaders } from '@/features/core/api/client';

const PAGE_SIZE = '8';

export function listContainers(headers: IncomingHeaders, query?: URLSearchParams) {
  const params: Record<string, string> = { limit: query?.get('limit') ?? PAGE_SIZE };
  const cursor = query?.get('cursor');
  if (cursor) params.cursor = cursor;
  const search = query?.get('search');
  if (search) params.search = search;
  const status = query?.get('status');
  if (status) params.status = status;
  return apiListContainers(serverClient(headers), params);
}
