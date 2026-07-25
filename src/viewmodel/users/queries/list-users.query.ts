import { listUsers as apiListUsers } from '@model/users';
import { serverClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

export function listUsers(headers: IncomingHeaders, query?: URLSearchParams) {
  const params: Record<string, string> = { limit: query?.get('limit') ?? '50' };
  const cursor = query?.get('cursor');
  if (cursor) params.cursor = cursor;
  const search = query?.get('search');
  if (search) params.search = search;
  return apiListUsers(serverClient(headers), params);
}
