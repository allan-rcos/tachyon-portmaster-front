import { getContainer as apiGetContainer } from '@model/containers';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

/** id base62 opaco — sem conversão. */
export function getContainer(id: string, headers?: IncomingHeaders) {
  return apiGetContainer(resolveClient(headers), id);
}
