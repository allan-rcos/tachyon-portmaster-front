import { serverCall, type IncomingHeaders } from '@/services/clients/server';
import { listContainers as codec } from '@/services/codecs/flow/v1/container';

const PAGE_SIZE = '8';

export function listContainers(headers: IncomingHeaders, query?: URLSearchParams) {
  const params = new URLSearchParams();
  params.set('limit', query?.get('limit') ?? PAGE_SIZE);
  const cursor = query?.get('cursor');
  if (cursor) params.set('cursor', cursor);
  const search = query?.get('search');
  if (search) params.set('search', search);
  const status = query?.get('status');
  if (status) params.set('status', status);
  return serverCall(codec, { query: params }, headers);
}
