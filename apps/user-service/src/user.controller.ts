import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToClass } from 'class-transformer';
import {
  CreateUserRequest,
  DeleteUserRequest,
  Empty,
  GetUserRequest,
  ListUsersRequest,
  UpdateUserRequest,
  USER_SERVICE_NAME,
  UserResponse,
  UserServiceController,
  UserServiceControllerMethods,
  ListUsersResponse,
} from 'libs/proto/user/generated/user';
import { PaginationOptions } from 'libs/core/src/interfaces';
import { UserResponseDto } from './dto/user-response.dto';

@Controller()
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'CreateUser')
  async createUser(request: CreateUserRequest): Promise<UserResponse> {
    const createUserDto = plainToClass(CreateUserDto, {
      fullName: request.fullName,
      email: request.email,
      password: request.password,
      departmentId: request.departmentId,
      employeeId: request.employeeId,
      siteId: request.siteId,
      roleId: request.roleId,
    });

    const user = await this.userService.createUser(createUserDto);
    return this.transformToUserResponse(user);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUser')
  async getUser(request: GetUserRequest): Promise<UserResponse> {
    const user = await this.userService.getUserById(
      request.id,
      request.departmentId,
    );
    return user;
  }

  @GrpcMethod(USER_SERVICE_NAME, 'UpdateUser')
  async updateUser(request: UpdateUserRequest): Promise<UserResponse> {
    const updateUserDto = plainToClass(UpdateUserDto, {
      fullName: request.fullName,
      email: request.email,
      password: request.password,
      employeeId: request.employeeId,
      siteId: request.siteId,
      roleId: request.roleId,
      isActive: request.isActive,
    });

    const user = await this.userService.updateUser(
      request.id,
      request.departmentId,
      updateUserDto,
    );
    return this.transformToUserResponse(user);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'DeleteUser')
  async deleteUser(request: DeleteUserRequest): Promise<Empty> {
    await this.userService.deleteUser(request.id, request.departmentId);
    return {};
  }

  @GrpcMethod(USER_SERVICE_NAME, 'ListUsers')
  async listUsers(request: ListUsersRequest): Promise<ListUsersResponse> {
    const paginationOptions: PaginationOptions = {
      pageSize: request.pageSize,
      pageNumber: request.pageNumber,
      sortBy: request.sortBy,
      sortOrder: request.sortOrder as 'asc' | 'desc',
      continuationToken: request.continuationToken,
      filter: request.filter,
    };

    const result = await this.userService.getAllUsers(paginationOptions);

    return {
      items: result.items.map((user) => this.transformToUserResponse(user)),
      meta: {
        currentPage: result.meta.currentPage,
        pageSize: result.meta.pageSize,
        totalPages: result.meta.totalPages,
        totalCount: result.meta.totalCount,
        hasNextPage: result.meta.hasNextPage,
        hasPreviousPage: result.meta.hasPreviousPage,
      },
      links: result.links,
      hasMoreResults: result.hasMoreResults || false,
      continuationToken: result.continuationToken,
    };
  }

  private transformToUserResponse(user: UserResponseDto): UserResponse {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      isActive: user.isActive,
      departmentId: user.departmentId,
      employeeId: user.employeeId,
      siteId: user.siteId,
      roleId: user.roleId,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
