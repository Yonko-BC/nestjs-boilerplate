import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'libs/core/src';
import { Email } from './email.vo';
import { Password } from './password.vo';

export class User extends BaseEntity {
  @ApiProperty({
    description: "User's full name",
    example: 'John Doe',
  })
  @Expose()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
  })
  @Expose()
  @Transform(({ value }) => new Email(value).value)
  email: string;

  @ApiProperty({
    description: "User's hashed password",
    example: '$2b$10$...',
  })
  @Expose()
  @Transform(({ value }) => new Password(value).value)
  password: string;

  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
  })
  @Expose()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: "User's department ID",
    example: 'dept-123',
  })
  @Expose()
  @IsString()
  departmentId: string;

  @ApiProperty({
    description: "User's employee ID",
    example: 'emp-456',
  })
  @Expose()
  @IsString()
  employeeId: string;

  @ApiProperty({
    description: "User's site ID",
    example: 'site-789',
  })
  @Expose()
  @IsString()
  siteId: string;

  @ApiProperty({
    description: "User's role ID",
    example: 'role-101',
  })
  @Expose()
  @IsString()
  roleId: string;

  constructor(
    fullName: string,
    email: string,
    password: string,
    isActive: boolean = true,
    departmentId: string,
    employeeId: string,
    siteId: string,
    roleId: string,
  ) {
    super(departmentId);
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.isActive = isActive;
    this.departmentId = departmentId;
    this.employeeId = employeeId;
    this.siteId = siteId;
    this.roleId = roleId;
  }

  deactivate(): void {
    this.isActive = false;
    this.updateTimestamp();
  }

  activate(): void {
    this.isActive = true;
    this.updateTimestamp();
  }

  updateProfile(fullName?: string, email?: string): void {
    if (fullName) {
      this.fullName = fullName;
    }
    if (email) {
      this.email = new Email(email).value;
    }
    this.updateTimestamp();
  }

  toObject(): Record<string, any> {
    return {
      ...super.toObject(),
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      isActive: this.isActive,
      departmentId: this.departmentId,
      employeeId: this.employeeId,
      siteId: this.siteId,
      roleId: this.roleId,
    };
  }
}
