import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class AdminService {
  async publishWebsite() {
    const deployHookUrl = process.env.FRONTEND_DEPLOY_HOOK_URL?.trim();

    if (!deployHookUrl) {
      throw new BadRequestException(
        'FRONTEND_DEPLOY_HOOK_URL is not configured on the backend.',
      );
    }

    try {
      const response = await fetch(deployHookUrl, {
        method: 'POST',
      });

      if (!response.ok) {
        const responseBody = await response.text();
        throw new InternalServerErrorException(
          `Deploy hook request failed with status ${response.status}. Response: ${responseBody || 'empty body'}`,
        );
      }

      return {
        success: true,
        message: 'Frontend publish hook triggered successfully.',
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Unable to trigger frontend publish hook.',
      );
    }
  }
}
