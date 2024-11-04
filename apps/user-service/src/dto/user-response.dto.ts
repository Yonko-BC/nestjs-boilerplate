import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { EntityMetadata } from 'libs/core/src';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  fullName: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty()
  departmentId: string;

  @Expose()
  @ApiProperty()
  employeeId: string;

  @Expose()
  @ApiProperty()
  siteId: string;

  @Expose()
  @ApiProperty()
  roleId: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty()
  metadata: EntityMetadata;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
