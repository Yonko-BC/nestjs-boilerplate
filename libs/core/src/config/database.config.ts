import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class DatabaseConfig {
  @IsString()
  COSMOS_ENDPOINT: string;

  @IsString()
  COSMOS_KEY: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  COSMOS_REQUEST_TIMEOUT?: number = 30000;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  COSMOS_MAX_RETRIES?: number = 3;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  COSMOS_RETRY_INTERVAL?: number = 1000;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  COSMOS_MAX_WAIT_TIME?: number = 60;

  @IsString()
  @IsNotEmpty()
  COSMOS_DATABASE_ID: string;
}
