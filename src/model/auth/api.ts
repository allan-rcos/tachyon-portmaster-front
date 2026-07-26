import type { ApiClient } from '@model/core/http';
import { wire } from '@model/core/wire';

import type { LoginRequest, LoginResponse } from './dto';
import { encLogin, decLoginResponse } from './fbs';

/**
 * POST /v1/auth/login — o slug do tenant vai no corpo do LoginRequest.
 * @param c Cliente HTTP configurado.
 * @param body Credenciais de acesso.
 */
export const login = (c: ApiClient, body: LoginRequest): Promise<LoginResponse> =>
  wire(c, {
    method: 'POST',
    path: '/v1/auth/login',
    body,
    encode: encLogin,
    decode: decLoginResponse,
  });
