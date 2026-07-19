import { serverCall, type IncomingHeaders } from '@/services/clients/server';
import { getContainer as codec } from '@/services/codecs/flow/v1/container';

/** id base62 opaco — sem conversão. */
export function getContainer(id: string, headers: IncomingHeaders) {
  return serverCall(codec, { params: { id } }, headers);
}
