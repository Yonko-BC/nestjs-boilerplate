import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: { email: string; password: string }) {
    console.log('createUserDto', createUserDto);
    return this.userService.createUser({
      email: createUserDto.email,
      password: createUserDto.password,
      partitionKey: 'user',
    });
  }
}
