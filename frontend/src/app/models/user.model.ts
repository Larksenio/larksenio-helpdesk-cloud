export interface User {
  id: number;
  name?: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}