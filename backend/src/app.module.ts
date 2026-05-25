import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [HealthModule, ProductsModule, UsersModule],
})
export class AppModule {}
