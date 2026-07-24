import type { ApiClient } from '../core/http';
import { wire } from '../core/wire';

import { encLogin, decLoginResponse } from './fbs';
import type { LoginRequest, LoginResponse } from './dto';

/** POST /v1/auth/login — o slug do tenant vai no corpo do LoginRequest. */
export const login = (c: ApiClient, body: LoginRequest): Promise<LoginResponse> =>
  wire(c, {
    method: 'POST',
    path: '/v1/auth/login',
    body,
    encode: encLogin,
    decode: decLoginResponse,
  });
