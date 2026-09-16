import type { UploadedFile } from '../../../common/types/uploaded-file.type.js';

export const PERFUME_GENDERS = ['male', 'female', 'unisex'] as const;
export type PerfumeGender = (typeof PERFUME_GENDERS)[number];

export type PerfumeInput = {
  name: string;
  description: string;
  gender: PerfumeGender;
  categoryId: number;
  price: number;
  price10Ml: number;
  price30Ml: number;
  price55Ml: number;
  price100Ml: number;
  is10MlEnabled?: boolean;
  is30MlEnabled?: boolean;
  is55MlEnabled?: boolean;
  is100MlEnabled?: boolean;
};

export type CreatePerfumeInput = PerfumeInput & {
  image: UploadedFile;
};

export type UpdatePerfumeInput = PerfumeInput & {
  id: number;
  image?: UploadedFile;
};
