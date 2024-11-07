import { Exclude, Expose } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { validateEntity } from '../utils/validation.utils';
import {
  TransformDate,
  TransformToString,
} from '../decorators/entity-transform.decorator';

export type EntityMetadata = {
  id: string;
  partitionKey: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  type: string;
};

export type EntityConstructorParams = Partial<EntityMetadata>;

@Exclude()
export abstract class BaseEntity {
  @ApiProperty({
    description: 'Unique identifier of the entity',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @TransformToString()
  readonly id: string;

  @ApiProperty({
    description: 'Partition key for Cosmos DB',
    example: 'department_123',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @TransformToString()
  readonly partitionKey: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-10-30T10:30:00.000Z',
    format: 'date-time',
  })
  @Expose()
  @IsDate()
  @TransformDate()
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-10-30T10:30:00.000Z',
    format: 'date-time',
  })
  @Expose()
  @IsDate()
  @TransformDate()
  updatedAt: Date;

  @ApiProperty({
    description: 'Entity version for optimistic concurrency',
    example: 1,
    minimum: 1,
  })
  @Expose()
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  version: number;

  @ApiProperty({
    description: 'Entity type discriminator',
    example: 'User',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @ApiPropertyOptional({
    description: 'Soft delete flag',
    example: false,
  })
  @Expose()
  @IsOptional()
  @ValidateIf((o) => o.deleted !== undefined)
  deleted?: boolean;

  @ApiPropertyOptional({
    description: 'Entity metadata for tracking purposes',
    example: { source: 'import', batch: 'batch123' },
  })
  @Expose()
  @IsOptional()
  metadata?: Record<string, unknown>;

  constructor(params: EntityConstructorParams = {}) {
    this.id = params.id || uuidv4();
    this.partitionKey = params.partitionKey || '';
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
    this.version = params.version || 1;
    this.type = this.constructor.name;
    this.deleted = false;
    this.metadata = {};
  }

  updateTimestamp(incrementVersion = true): void {
    this.updatedAt = new Date();
    if (incrementVersion) {
      this.version += 1;
    }
  }

  equals(other: BaseEntity): boolean {
    if (!(other instanceof BaseEntity)) {
      return false;
    }
    return (
      this.id === other.id &&
      this.partitionKey === other.partitionKey &&
      this.version === other.version
    );
  }

  clone(): this {
    const Constructor = this.constructor as new (
      params: EntityConstructorParams,
    ) => this;
    return new Constructor({
      id: this.id,
      partitionKey: this.partitionKey,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
      version: this.version,
      ...this.metadata,
    });
  }

  toObject(excludeMetadata = false): Record<string, any> {
    const obj: Record<string, any> = {
      id: this.id,
      partitionKey: this.partitionKey,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      version: this.version,
      type: this.type,
      deleted: this.deleted,
      metadata: this.metadata,
    };

    if (!excludeMetadata && Object.keys(this.metadata || {}).length > 0) {
      obj.metadata = this.metadata;
    }

    return obj;
  }

  validate(): void {
    validateEntity(this);
  }

  static fromObject<T extends BaseEntity>(
    this: new (params: EntityConstructorParams) => T,
    data: Record<string, any>,
  ): T {
    const entity = new this(data);
    entity.validate();
    return entity;
  }
}
