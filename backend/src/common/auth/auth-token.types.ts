export type AuthTokenPayload = {
  sub: number;
  email: string;
  role: string;
  exp?: number;
};
