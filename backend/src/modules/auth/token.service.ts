import { Injectable, InternalServerErrorException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

type TokenPayload = {
  sub: number;
  email: string;
  role: string;
};

@Injectable()
export class TokenService {
  sign(payload: TokenPayload): string {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = this.getJwtExpiresIn();

    if (!jwtSecret) {
      throw new InternalServerErrorException(
        'Missing JWT_SECRET environment variable',
      );
    }

    return jwt.sign(payload, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });
  }

  private getJwtExpiresIn(): SignOptions['expiresIn'] {
    const raw = process.env.JWT_EXPIRES_IN?.trim();

    if (!raw) {
      return '7d';
    }

    if (/^\d+$/.test(raw)) {
      return Number(raw);
    }

    if (this.isMsDuration(raw)) {
      return raw;
    }

    throw new InternalServerErrorException(
      'Invalid JWT_EXPIRES_IN format. Use values like "7d", "12h", or seconds like "3600".',
    );
  }

  private isMsDuration(value: string): value is StringValue {
    return /^\d+(\.\d+)?\s*(ms|s|m|h|d|w|y)$/i.test(value);
  }
}
