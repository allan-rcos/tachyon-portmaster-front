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

/**
 * Corpo do bootstrap: o primeiro usuário de uma instalação sem nenhum.
 *
 * Sem senha inicial de terceiro nem perfis — quem passa por aqui recebe um papel
 * `Administrator` com todas as permissões registradas e já sai autenticado. O
 * endpoint responde 409 assim que qualquer usuário existe, então abre uma vez só
 * na vida do deployment.
 */
export interface SetupRequest {
  name: string;
  email: string;
  password: string;
}
