import { toBytes, buf, fromT } from '@model/core/fbs-runtime';

import type { LoginRequest, LoginResponse } from './dto';

import { LoginRequestT } from '@/fbs/api/fbs/auth/login-request';
import { LoginResponse as FbLoginResponse } from '@/fbs/api/fbs/auth/login-response';

export const encLogin = (v: LoginRequest): Uint8Array =>
  toBytes(new LoginRequestT(v.email, v.password));

export const decLoginResponse = (b: Uint8Array): LoginResponse =>
  fromT(FbLoginResponse.getRootAsLoginResponse(buf(b)).unpack()) as LoginResponse;
