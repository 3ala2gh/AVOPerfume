import { Transform, type TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { trimString } from '../../../common/transformers/request-value.transformers.js';

export class LoginDto {
  @IsEmail()
  @Transform(({ value }: TransformFnParams) => trimString(value))
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
