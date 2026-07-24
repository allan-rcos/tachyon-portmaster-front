import { getUser as apiGetUser } from 'tachyon-portmaster-sdk/users';

import { serverClient, type IncomingHeaders } from '@/features/core/api/client';

export function getUser(id: string, headers: IncomingHeaders) {
  return apiGetUser(serverClient(headers), id);
}
