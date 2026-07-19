import { serverCall, type IncomingHeaders } from '@/services/clients/server';
import { getAccount as codec } from '@/services/codecs/flow/v1/account';

export function getAccount(headers: IncomingHeaders) {
  return serverCall(codec, {}, headers);
}
