import { IsString, IsNumber, IsOptional } from 'class-validator';

export class DatabaseConfig {
  @IsString()
  COSMOS_ENDPOINT: string;

  @IsString()
  COSMOS_KEY: string;

  @IsString()
  COSMOS_DATABASE_ID: string;

  // @IsNumber()
  @IsOptional()
  COSMOS_REQUEST_TIMEOUT?: number = 30000;

  // @IsNumber()
  @IsOptional()
  COSMOS_MAX_RETRIES?: number = 3;

  // @IsNumber()
  @IsOptional()
  COSMOS_RETRY_INTERVAL?: number = 1000;

  // @IsNumber()
  @IsOptional()
  COSMOS_MAX_WAIT_TIME?: number = 60;
}
