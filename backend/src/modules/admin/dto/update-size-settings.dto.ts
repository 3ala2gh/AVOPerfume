import { IsBoolean } from 'class-validator';

export class UpdateSizeSettingsDto {
  @IsBoolean()
  is10MlEnabled!: boolean;

  @IsBoolean()
  is30MlEnabled!: boolean;

  @IsBoolean()
  is55MlEnabled!: boolean;

  @IsBoolean()
  is100MlEnabled!: boolean;
}
