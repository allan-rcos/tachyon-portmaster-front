/** Credenciais enviadas na autenticação. */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Identificação do usuário devolvida junto do token. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

/** Resposta da autenticação: token de sessão e usuário. */
export interface LoginResponse {
  token: string;
  token_type: string;
  user: AuthUser;
}
