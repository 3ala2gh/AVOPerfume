import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { UploadedFile } from '../types/uploaded-file.type.js';

type ImageFilePipeOptions = {
  required?: boolean;
};

@Injectable()
export class ImageFilePipe implements PipeTransform<
  UploadedFile | undefined,
  UploadedFile | undefined
> {
  constructor(private readonly options: ImageFilePipeOptions = {}) {}

  transform(file: UploadedFile | undefined): UploadedFile | undefined {
    if (!file) {
      if (this.options.required) {
        throw new BadRequestException('Image is required');
      }

      return undefined;
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    return file;
  }
}
