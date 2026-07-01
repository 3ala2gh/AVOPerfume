import { Module } from '@nestjs/common';
import { AuthTokenModule } from './common/auth/auth-token.module.js';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { ProductsModule } from './modules/products/products.module.js';

@Module({
  imports: [
    AuthTokenModule,
    PrismaModule,
    AuthModule,
    AdminModule,
    ProductsModule,
  ],
})
export class AppModule {}
