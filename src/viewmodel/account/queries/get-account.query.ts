import { getAccount as apiGetAccount } from '@model/account';
import { serverClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

export function getAccount(headers: IncomingHeaders) {
  return apiGetAccount(serverClient(headers));
}
