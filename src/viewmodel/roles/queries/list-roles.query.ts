import { listRoles as apiListRoles } from '@model/roles';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

export function listRoles(headers?: IncomingHeaders, query?: URLSearchParams) {
  const params: Record<string, string> = { limit: query?.get('limit') ?? '50' };
  const cursor = query?.get('cursor');
  if (cursor) params.cursor = cursor;
  return apiListRoles(resolveClient(headers), params);
}
