import type { LoginRequest, LoginResponse } from './dto';
import { toBytes, buf, fromT } from '../core/fbs-runtime';
import { LoginRequestT } from '../generated/fbs/api/fbs/auth/login-request';
import { LoginResponse as FbLoginResponse } from '../generated/fbs/api/fbs/auth/login-response';

export const encLogin = (v: LoginRequest): Uint8Array =>
  toBytes(new LoginRequestT(v.email, v.password));

export const decLoginResponse = (b: Uint8Array): LoginResponse =>
  fromT(FbLoginResponse.getRootAsLoginResponse(buf(b)).unpack()) as LoginResponse;
