import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches, IsUUID } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
  })
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'The password for the user account',
  })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @ApiProperty({
    example: 'dept-123',
    description: 'The department ID the user belongs to',
  })
  @IsUUID()
  departmentId: string;

  @ApiProperty({
    example: 'EMP001',
    description: 'The employee ID of the user',
  })
  @IsString()
  @Matches(/^EMP\d{3,}$/, {
    message: 'Employee ID must start with EMP followed by at least 3 numbers',
  })
  employeeId: string;

  @ApiProperty({
    example: 'site-789',
    description: 'The site ID where the user is located',
  })
  @IsUUID()
  siteId: string;

  @ApiProperty({
    example: 'role-101',
    description: 'The role ID assigned to the user',
  })
  @IsUUID()
  roleId: string;
}
