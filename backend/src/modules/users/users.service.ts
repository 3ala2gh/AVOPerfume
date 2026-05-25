import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: UserEntity[] = [
    {
      id: 'u-001',
      firstName: 'Avo',
      lastName: 'Admin',
      email: 'admin@avoperfume.com',
    },
  ];

  findAll() {
    return this.users;
  }
}
