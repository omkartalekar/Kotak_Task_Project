export interface AuthResponse {
  token: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name?: string;
  role?: 'USER' | 'PROVIDER' | 'ADMIN';
}

export interface JWTPayload {
  id: string;
  role: 'USER' | 'PROVIDER' | 'ADMIN';
  iat?: number;
  exp?: number;
}
