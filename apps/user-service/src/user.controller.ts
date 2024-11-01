import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log('createUserDto', createUserDto);
    return this.userService.createUser({
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      password: createUserDto.password,
      departmentId: createUserDto.departmentId,
      employeeId: createUserDto.employeeId,
      siteId: createUserDto.siteId, // New field
      roleId: createUserDto.roleId, // New field
    });
  }
}
