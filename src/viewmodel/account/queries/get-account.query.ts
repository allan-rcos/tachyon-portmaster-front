import { getAccount as apiGetAccount } from '@model/account';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

export function getAccount(headers?: IncomingHeaders) {
  return apiGetAccount(resolveClient(headers));
}
