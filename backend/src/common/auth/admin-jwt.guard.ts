import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';

type JwtPayload = {
  sub: number;
  email: string;
  role: string;
  exp?: number;
};

@Injectable()
export class AdminJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: { authorization?: string } }>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization token');
    }

    const token = authorization.slice('Bearer '.length).trim();
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new InternalServerErrorException(
        'Missing JWT_SECRET environment variable',
      );
    }

    let payload: JwtPayload;
    try {
      const decoded = jwt.verify(token, jwtSecret) as unknown;
      if (
        !decoded ||
        typeof decoded !== 'object' ||
        !('role' in decoded) ||
        typeof decoded.role !== 'string'
      ) {
        throw new UnauthorizedException('Invalid token payload');
      }
      payload = decoded as JwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (payload.role.toLowerCase() !== 'admin') {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
