import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedResult, PaginationOptions } from 'libs/core/src/interfaces';
import { UpdateUserDto } from './dto/update-user.dto';
import { BusinessException } from 'libs/core/src/exceptions/business.exception';
import { Email } from './entities/email.vo';
import { Password } from './entities/password.vo';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BusinessException(
        'USER_EMAIL_TAKEN',
        'Email address is already in use',
        { email: dto.email },
      );
    }

    const user = new User({
      ...dto,
      partitionKey: dto.departmentId,
    });

    const createdUser = await this.userRepository.create(user);
    return plainToClass(UserResponseDto, createdUser);
  }

  async getUserById(
    id: string,
    departmentId: string,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id, departmentId);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return plainToClass(UserResponseDto, user);
  }

  async getAllUsers(
    options?: PaginationOptions,
  ): Promise<PaginatedResult<UserResponseDto>> {
    const result = await this.userRepository.findAll(options);
    return {
      ...result,
      items: result.items.map((user) => plainToClass(UserResponseDto, user)),
    };
  }

  async updateUser(
    id: string,
    departmentId: string,
    updateData: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id, departmentId);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateData.email) {
      const existingUser = await this.userRepository.findByEmail(
        updateData.email,
      );
      if (existingUser && existingUser.id !== id) {
        throw new BusinessException(
          'USER_EMAIL_TAKEN',
          'Email address is already in use',
          { email: updateData.email },
        );
      }
    }

    const transformedData = {
      ...updateData,
      email: updateData.email
        ? new Email(updateData.email).getValue()
        : undefined,
      password: updateData.password
        ? new Password(updateData.password).value
        : undefined,
    };

    const updatedUser = await this.userRepository.update(
      id,
      departmentId,
      transformedData,
    );

    return plainToClass(UserResponseDto, updatedUser);
  }

  async deleteUser(id: string, departmentId: string): Promise<void> {
    const user = await this.userRepository.findById(id, departmentId);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id, departmentId);
  }
}
