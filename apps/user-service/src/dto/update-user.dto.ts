import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'The full name of the user',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @ApiPropertyOptional({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'StrongPass123!',
    description: 'The password for the user account',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is too weak - Must contain uppercase, lowercase, number/special character',
  })
  password?: string;

  @ApiPropertyOptional({
    example: 'dept-123',
    description: 'The department ID the user belongs to',
  })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional({
    example: 'EMP001',
    description: 'The employee ID of the user',
  })
  @IsOptional()
  @IsString()
  @Matches(/^EMP\d{3,}$/, {
    message: 'Employee ID must start with EMP followed by at least 3 numbers',
  })
  employeeId?: string;

  @ApiPropertyOptional({
    example: 'site-789',
    description: 'The site ID where the user is located',
  })
  @IsOptional()
  @IsUUID()
  siteId?: string;

  @ApiPropertyOptional({
    example: 'role-101',
    description: 'The role ID assigned to the user',
  })
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the user is active',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;
}
