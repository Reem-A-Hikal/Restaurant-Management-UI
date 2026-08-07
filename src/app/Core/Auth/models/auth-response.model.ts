export interface AuthResponse {
  token: string;
  refreshToken: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
}
