import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME ?? process.env.CLOUDINARY_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = 'avo-perfume',
  ): Promise<{ secureUrl: string; publicId: string }> {
    if (!file?.buffer) {
      throw new InternalServerErrorException('Invalid file payload');
    }

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(
              error ??
                new InternalServerErrorException(
                  'Cloudinary upload returned no result',
                ),
            );
            return;
          }

          resolve(uploadResult);
        },
      );

      stream.end(file.buffer);
    });

    return {
      secureUrl: result.secure_url,
      publicId: result.public_id,
    };
  }
}
