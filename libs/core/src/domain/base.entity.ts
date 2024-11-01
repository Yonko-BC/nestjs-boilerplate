import { Expose, Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @ApiProperty({
    description: 'Unique identifier of the entity',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Partition key for Cosmos DB',
    example: 'users',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  partitionKey: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-10-30T10:30:00.000Z',
    format: 'date-time',
  })
  @Expose()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-10-30T10:30:00.000Z',
    format: 'date-time',
  })
  @Expose()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  updatedAt: Date;

  @ApiProperty({
    description: 'Entity type discriminator',
    example: 'User',
  })
  @Expose()
  @IsString()
  type: string;

  constructor(partitionKey?: string, id?: string) {
    this.id = id || uuidv4();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.type = this.constructor.name;
    this.partitionKey = partitionKey || '';
  }

  equals(other: BaseEntity): boolean {
    if (!(other instanceof BaseEntity)) {
      return false;
    }
    return this.id === other.id && this.partitionKey === other.partitionKey;
  }

  notEquals(other: BaseEntity): boolean {
    return !this.equals(other);
  }

  updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  clone(): this {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  toObject(): Record<string, any> {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      type: this.type,
    };
  }
}
