import { enc, dec } from '@/services/fbs';
import type {
  AccountProfile,
  AccountUpdateRequest,
  AccountPasswordChangeRequest,
} from '@/services/gen/flow/v1/account';
import type { Codec, CallArgs } from '@/services/http';

export const getAccount: Codec<CallArgs, AccountProfile> = {
  method: 'GET',
  path: () => '/v1/account',
  encode: () => undefined,
  decode: (raw) => raw as AccountProfile,
  fbsDecode: dec.accountProfile,
};

export const updateAccount: Codec<CallArgs<AccountUpdateRequest>, AccountProfile> = {
  method: 'PUT',
  path: () => '/v1/account',
  encode: (r) => r.body,
  decode: (raw) => raw as AccountProfile,
  fbsEncode: (r) => enc.accountUpdate(r.body!),
  fbsDecode: dec.accountProfile,
};

export const changePassword: Codec<CallArgs<AccountPasswordChangeRequest>, null> = {
  method: 'PUT',
  path: () => '/v1/account/password',
  encode: (r) => r.body,
  decode: () => null,
  fbsEncode: (r) => enc.accountPassword(r.body!),
};
