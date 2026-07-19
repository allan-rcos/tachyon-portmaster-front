import { enc, dec } from '@/services/fbs';
import type { LoginRequest, LoginResponse } from '@/services/gen/flow/v1/auth';
import type { Codec, CallArgs } from '@/services/http';

export const login: Codec<CallArgs<LoginRequest>, LoginResponse> = {
  method: 'POST',
  path: () => '/v1/auth/login',
  encode: (r) => r.body,
  decode: (raw) => raw as LoginResponse,
  fbsEncode: (r) => enc.login(r.body!),
  fbsDecode: dec.loginResponse,
};
