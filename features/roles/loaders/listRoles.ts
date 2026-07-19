import { serverCall, type IncomingHeaders } from '@/services/clients/server';
import { listRoles as codec } from '@/services/codecs/flow/v1/role';

export function listRoles(headers: IncomingHeaders, query?: URLSearchParams) {
  const params = new URLSearchParams();
  params.set('limit', query?.get('limit') ?? '50');
  const cursor = query?.get('cursor');
  if (cursor) params.set('cursor', cursor);
  return serverCall(codec, { query: params }, headers);
}
