import { listRoles as apiListRoles } from 'tachyon-portmaster-sdk/roles';

import { serverClient, type IncomingHeaders } from '@/features/core/api/client';

export function listRoles(headers: IncomingHeaders, query?: URLSearchParams) {
  const params: Record<string, string> = { limit: query?.get('limit') ?? '50' };
  const cursor = query?.get('cursor');
  if (cursor) params.cursor = cursor;
  return apiListRoles(serverClient(headers), params);
}
