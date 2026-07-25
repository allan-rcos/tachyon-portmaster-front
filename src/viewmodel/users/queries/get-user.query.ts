import { getUser as apiGetUser } from '@model/users';
import { serverClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

export function getUser(id: string, headers: IncomingHeaders) {
  return apiGetUser(serverClient(headers), id);
}
