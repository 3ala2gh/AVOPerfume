import { Injectable } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly products: ProductEntity[] = [
    {
      id: 'p-001',
      name: 'AVO Velvet Oud',
      description: 'Warm oud blend with amber and vanilla.',
      price: 89,
    },
    {
      id: 'p-002',
      name: 'AVO Citrus Bloom',
      description: 'Fresh citrus opening with soft floral heart.',
      price: 65,
    },
  ];

  findAll() {
    return this.products;
  }
}
