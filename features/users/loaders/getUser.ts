import { serverCall, type IncomingHeaders } from '@/services/clients/server';
import { getUser as codec } from '@/services/codecs/flow/v1/user';

export function getUser(id: string, headers: IncomingHeaders) {
  return serverCall(codec, { params: { id } }, headers);
}
