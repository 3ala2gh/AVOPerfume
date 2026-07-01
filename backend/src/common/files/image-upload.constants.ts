import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface.js';

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export const IMAGE_UPLOAD_OPTIONS: MulterOptions = {
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
    files: 1,
  },
};
