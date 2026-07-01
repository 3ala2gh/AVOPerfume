import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PASSWORD_SALT_ROUNDS } from './password.constants.js';

@Injectable()
export class PasswordService {
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  }

  verify(plainPassword: string, storedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, storedPassword);
  }
}
