import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthTokenService } from './auth-token.service.js';

type RequestWithAuthorizationHeader = {
  headers: {
    authorization?: string;
  };
};

@Injectable()
export class AdminJwtGuard implements CanActivate {
  constructor(private readonly tokenService: AuthTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithAuthorizationHeader>();
    const token = this.extractBearerToken(request.headers.authorization);
    const payload = this.tokenService.verify(token);

    if (payload.role.toLowerCase() !== 'admin') {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }

  private extractBearerToken(authorization?: string): string {
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization token');
    }

    const token = authorization.slice('Bearer '.length).trim();

    if (!token) {
      throw new UnauthorizedException('Missing or invalid authorization token');
    }

    return token;
  }
}
