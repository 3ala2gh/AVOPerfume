import { ArrayMaxSize, ArrayUnique, IsArray, IsInt } from 'class-validator';

export class UpdateBestSellersDto {
  @IsArray()
  @ArrayMaxSize(6)
  @ArrayUnique()
  @IsInt({ each: true })
  perfumeIds!: number[];
}
