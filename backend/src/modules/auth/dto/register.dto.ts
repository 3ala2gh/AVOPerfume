import { Transform, type TransformFnParams } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { MIN_PASSWORD_LENGTH } from '../../../common/auth/password.constants.js';
import { trimString } from '../../../common/transformers/request-value.transformers.js';

export class RegisterDto {
  @IsEmail()
  @Transform(({ value }: TransformFnParams) => trimString(value))
  email!: string;

  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  password!: string;

  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  confirmPassword!: string;
}
