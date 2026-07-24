import { getContainer as apiGetContainer } from 'tachyon-portmaster-sdk/containers';

import { serverClient, type IncomingHeaders } from '@/features/core/api/client';

/** id base62 opaco — sem conversão. */
export function getContainer(id: string, headers: IncomingHeaders) {
  return apiGetContainer(serverClient(headers), id);
}
