export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  token_type: string;
  user: AuthUser;
}
