import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { SupabaseModule } from './common/supabase/supabase.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PrismaModule,
    SupabaseModule,
    ProductsModule,
    UsersModule,
  ],
})
export class AppModule {}
