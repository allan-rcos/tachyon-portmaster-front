import { LoginRequestT } from '../fbs-gen/api/fbs/auth/login-request';
import { LoginResponse as FbLoginResponse } from '../fbs-gen/api/fbs/auth/login-response';
import { toBytes, buf, fromT } from '../core/fbs-runtime';

import type { LoginRequest, LoginResponse } from './dto';

export const encLogin = (v: LoginRequest): Uint8Array => toBytes(new LoginRequestT(v.email, v.password));

export const decLoginResponse = (b: Uint8Array): LoginResponse =>
  fromT(FbLoginResponse.getRootAsLoginResponse(buf(b)).unpack()) as LoginResponse;
