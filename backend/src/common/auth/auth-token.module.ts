import { Global, Module } from '@nestjs/common';
import { AuthTokenService } from './auth-token.service.js';

@Global()
@Module({
  providers: [AuthTokenService],
  exports: [AuthTokenService],
})
export class AuthTokenModule {}
