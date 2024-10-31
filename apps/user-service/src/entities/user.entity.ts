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

  constructor(
    fullName: string,
    email: string,
    password: string,
    isActive: boolean = true,
  ) {
    super('user');

    console.log({ fullName, email, password, isActive });

    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.isActive = isActive;
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
    };
  }
}
