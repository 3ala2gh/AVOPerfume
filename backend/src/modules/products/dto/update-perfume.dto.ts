import { Transform, type TransformFnParams } from 'class-transformer';
import { IsString } from 'class-validator';
import { trimString } from '../../../common/transformers/request-value.transformers.js';
import { PerfumeDto } from './perfume.dto.js';

export class UpdatePerfumeDto extends PerfumeDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => trimString(value))
  description!: string;
}
