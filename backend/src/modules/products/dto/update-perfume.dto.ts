import { Transform, type TransformFnParams } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

const trimIfString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class UpdatePerfumeDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => trimIfString(value as unknown))
  name!: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => trimIfString(value as unknown))
  description!: string;

  @IsString()
  @IsIn(['male', 'female', 'unisex'])
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  gender!: 'male' | 'female' | 'unisex';

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  categoryId!: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0.01)
  price!: number;
}
