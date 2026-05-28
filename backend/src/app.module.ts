import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { SupabaseModule } from './common/supabase/supabase.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { UsersModule } from './modules/users/users.module.js';

@Module({
  imports: [
    PrismaModule,
    SupabaseModule,
    AuthModule,
    ProductsModule,
    UsersModule,
  ],
})
export class AppModule {}
