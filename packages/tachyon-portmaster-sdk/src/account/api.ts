import type { ApiClient } from '../core/http';
import { wire } from '../core/wire';

import { encAccountUpdate, encAccountPassword, decAccountProfile } from './fbs';
import type { AccountProfile, AccountUpdateRequest, AccountPasswordChangeRequest } from './dto';

export const getAccount = (c: ApiClient): Promise<AccountProfile> =>
  wire(c, { method: 'GET', path: '/v1/account', decode: decAccountProfile });

export const updateAccount = (c: ApiClient, body: AccountUpdateRequest): Promise<AccountProfile> =>
  wire(c, {
    method: 'PUT',
    path: '/v1/account',
    body,
    encode: encAccountUpdate,
    decode: decAccountProfile,
  });

export const changePassword = (c: ApiClient, body: AccountPasswordChangeRequest): Promise<null> =>
  wire(c, { method: 'PUT', path: '/v1/account/password', body, encode: encAccountPassword });
