import { getUser as apiGetUser } from '@model/users';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

export function getUser(id: string, headers?: IncomingHeaders) {
  return apiGetUser(resolveClient(headers), id);
}
