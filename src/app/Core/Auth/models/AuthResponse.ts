export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  roles: string[];
  message: string;
}
