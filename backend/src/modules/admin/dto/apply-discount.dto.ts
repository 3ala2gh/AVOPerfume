import { ArrayNotEmpty, IsArray, IsBoolean, IsInt, IsNumber, Max, Min, ValidateIf } from 'class-validator';

export class ApplyDiscountDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent!: number;

  @IsBoolean()
  applyToAll!: boolean;

  @ValidateIf((input: ApplyDiscountDto) => !input.applyToAll)
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  perfumeIds!: number[];
}
