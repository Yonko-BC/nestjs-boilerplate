import { Injectable } from '@nestjs/common';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { User } from './entities/user.entity';
import { Email } from './entities/email.vo';
import { Password } from './entities/password.vo';

import { PaginatedResult, PaginationOptions } from 'libs/shared-kernel/src';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = new User(
      userData.fullName,
      userData.email,
      userData.password,
      true,
      userData.departmentId,
      userData.employeeId,
      userData.siteId,
      userData.roleId,
    );
    return this.userRepository.create(user);
  }

  async getUserById(id: string, partitionKey: string): Promise<User | null> {
    return this.userRepository.findById(id, partitionKey);
  }

  async getAllUsers(
    options?: PaginationOptions,
  ): Promise<PaginatedResult<User>> {
    return this.userRepository.findAll(options);
  }

  async updateUser(
    id: string,
    partitionKey: string,
    userData: Partial<User>,
  ): Promise<User> {
    const email = new Email(userData.email);
    const password = new Password(userData.password);
    // const user = new User(email.value, password.value, partitionKey);
    return this.userRepository.update(id, partitionKey, {});
  }

  async deleteUser(id: string, partitionKey: string): Promise<void> {
    await this.userRepository.delete(id, partitionKey);
  }
}
