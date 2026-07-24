import { getAccount as apiGetAccount } from 'tachyon-portmaster-sdk/account';

import { serverClient, type IncomingHeaders } from '@/features/core/api/client';

export function getAccount(headers: IncomingHeaders) {
  return apiGetAccount(serverClient(headers));
}
