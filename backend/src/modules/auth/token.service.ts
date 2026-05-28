import { Injectable, InternalServerErrorException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

type TokenPayload = {
  sub: number;
  email: string;
  role: string;
};

@Injectable()
export class TokenService {
  sign(payload: TokenPayload): string {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn =
      (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) ?? '7d';

    if (!jwtSecret) {
      throw new InternalServerErrorException(
        'Missing JWT_SECRET environment variable',
      );
    }

    return jwt.sign(payload, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });
  }
}
