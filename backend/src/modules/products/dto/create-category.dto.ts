import { Transform, type TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

const trimIfString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => trimIfString(value as unknown))
  name!: string;
}
