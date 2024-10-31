import { Injectable } from '@nestjs/common';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { User } from './entities/user.entity';
import { Email } from './entities/email.vo';
import { Password } from './entities/password.vo';

import { PaginatedResult, PaginationOptions } from 'libs/shared-kernel/src';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userData: {
    email: string;
    password: string;
    partitionKey: string;
  }): Promise<User> {
    const user = new User('yonko', userData.email, userData.password, true);
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
    const user = new User(email.value, password.value, partitionKey);
    return this.userRepository.update(id, partitionKey, user);
  }

  async deleteUser(id: string, partitionKey: string): Promise<void> {
    await this.userRepository.delete(id, partitionKey);
  }
}
