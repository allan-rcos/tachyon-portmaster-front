import { serverCall, type IncomingHeaders } from '@/services/clients/server';
import { getProduct as codec } from '@/services/codecs/flow/v1/product';

export function getProduct(id: string, headers: IncomingHeaders) {
  return serverCall(codec, { params: { id } }, headers);
}
