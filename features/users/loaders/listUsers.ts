import { serverCall, type IncomingHeaders } from '@/services/clients/server';
import { listUsers as codec } from '@/services/codecs/flow/v1/user';

export function listUsers(headers: IncomingHeaders, query?: URLSearchParams) {
  const params = new URLSearchParams();
  params.set('limit', query?.get('limit') ?? '50');
  const cursor = query?.get('cursor');
  if (cursor) params.set('cursor', cursor);
  const search = query?.get('search');
  if (search) params.set('search', search);
  return serverCall(codec, { query: params }, headers);
}
