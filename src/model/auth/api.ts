import type { ApiClient } from '@model/core/http';
import { wire } from '@model/core/wire';

import type { LoginRequest, LoginResponse, SetupRequest } from './dto';
import { encLogin, encSetup, decLoginResponse } from './fbs';

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

/**
 * POST /v1/setup — cria o primeiro usuário de uma instalação vazia.
 *
 * Não autenticado, e responde 409 assim que qualquer usuário existe. Devolve a
 * mesma `LoginResponse` do login: quem faz o bootstrap já entra logado.
 *
 * @param c Cliente HTTP configurado.
 * @param body Nome, e-mail e senha do usuário inicial.
 */
export const setup = (c: ApiClient, body: SetupRequest): Promise<LoginResponse> =>
  wire(c, {
    method: 'POST',
    path: '/v1/setup',
    body,
    encode: encSetup,
    decode: decLoginResponse,
  });
