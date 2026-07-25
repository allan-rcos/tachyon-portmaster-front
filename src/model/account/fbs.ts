import type { AccountProfile, AccountUpdateRequest, AccountPasswordChangeRequest } from './dto';
import { toBytes, buf, fromT } from '../core/fbs-runtime';
import { AccountPasswordChangeRequestT } from '../generated/fbs/api/fbs/account/account-password-change-request';
import { AccountProfileResponse as FbAccountProfileResponse } from '../generated/fbs/api/fbs/account/account-profile-response';
import { AccountUpdateRequestT } from '../generated/fbs/api/fbs/account/account-update-request';

export const encAccountUpdate = (v: AccountUpdateRequest): Uint8Array =>
  toBytes(new AccountUpdateRequestT(v.name, v.email));

export const encAccountPassword = (v: AccountPasswordChangeRequest): Uint8Array =>
  toBytes(new AccountPasswordChangeRequestT(v.current_password, v.new_password));

export const decAccountProfile = (b: Uint8Array): AccountProfile =>
  fromT(
    FbAccountProfileResponse.getRootAsAccountProfileResponse(buf(b)).unpack(),
  ) as AccountProfile;
