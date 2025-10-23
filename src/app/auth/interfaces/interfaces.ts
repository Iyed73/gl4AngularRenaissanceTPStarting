export interface AuthUser {
  id: number;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}