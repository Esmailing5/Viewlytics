export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
