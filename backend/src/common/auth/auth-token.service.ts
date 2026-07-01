import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import type { AuthTokenPayload } from './auth-token.types.js';

@Injectable()
export class AuthTokenService {
  sign(payload: AuthTokenPayload): string {
    return jwt.sign(payload, this.getSecret(), {
      expiresIn: this.getExpiresIn(),
    });
  }

  verify(token: string): AuthTokenPayload {
    let decoded: unknown;

    try {
      decoded = jwt.verify(token, this.getSecret());
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!this.isTokenPayload(decoded)) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return decoded;
  }

  private getSecret(): string {
    const secret = process.env.JWT_SECRET?.trim();

    if (!secret) {
      throw new InternalServerErrorException(
        'Missing JWT_SECRET environment variable',
      );
    }

    return secret;
  }

  private getExpiresIn(): SignOptions['expiresIn'] {
    const raw = process.env.JWT_EXPIRES_IN?.trim();

    if (!raw) {
      return '7d';
    }

    if (/^\d+$/.test(raw)) {
      return Number(raw);
    }

    if (/^\d+(\.\d+)?\s*(ms|s|m|h|d|w|y)$/i.test(raw)) {
      return raw as StringValue;
    }

    throw new InternalServerErrorException(
      'Invalid JWT_EXPIRES_IN format. Use values like "7d", "12h", or seconds like "3600".',
    );
  }

  private isTokenPayload(value: unknown): value is AuthTokenPayload {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const payload = value as Record<string, unknown>;

    return (
      typeof payload.sub === 'number' &&
      typeof payload.email === 'string' &&
      typeof payload.role === 'string'
    );
  }
}
