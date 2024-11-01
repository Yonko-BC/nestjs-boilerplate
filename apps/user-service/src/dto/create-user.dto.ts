import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  departmentId: string;

  @IsString()
  employeeId: string;

  @IsString()
  siteId: string;

  @IsString()
  roleId: string;
}
