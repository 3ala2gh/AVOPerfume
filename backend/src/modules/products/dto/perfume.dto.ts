import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import {
  normalizeLowercaseString,
  toNumber,
  trimString,
} from '../../../common/transformers/request-value.transformers.js';
import { PERFUME_GENDERS, type PerfumeGender } from '../types/perfume.types.js';

export abstract class PerfumeDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => trimString(value))
  name!: string;

  @IsString()
  @IsIn(PERFUME_GENDERS)
  @Transform(({ value }: TransformFnParams) => normalizeLowercaseString(value))
  gender!: PerfumeGender;

  @Transform(({ value }: TransformFnParams) => toNumber(value))
  @IsInt()
  @Min(1)
  categoryId!: number;

  @Transform(({ value }: TransformFnParams) => toNumber(value))
  @IsNumber()
  @Min(0.01)
  price!: number;

  @Transform(({ value }: TransformFnParams) => toNumber(value))
  @IsNumber()
  @Min(0.01)
  price10Ml!: number;

  @Transform(({ value }: TransformFnParams) => toNumber(value))
  @IsNumber()
  @Min(0.01)
  price30Ml!: number;

  @Transform(({ value }: TransformFnParams) => toNumber(value))
  @IsNumber()
  @Min(0.01)
  price55Ml!: number;

  @Transform(({ value }: TransformFnParams) => toNumber(value))
  @IsNumber()
  @Min(0.01)
  price100Ml!: number;
}
