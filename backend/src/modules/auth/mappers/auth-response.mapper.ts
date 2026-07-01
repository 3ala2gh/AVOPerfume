import type { AuthTokenService } from '../../../common/auth/auth-token.service.js';
import type { AuthResponse } from '../types/auth-response.type.js';

type AuthenticatedUser = {
  id: number;
  name: string;
  email: string;
  role: { name: string };
};

export function mapAuthResponse(
  user: AuthenticatedUser,
  tokenService: AuthTokenService,
): AuthResponse {
  const role = user.role.name;

  return {
    token: tokenService.sign({
      sub: user.id,
      email: user.email,
      role,
    }),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    },
  };
}
