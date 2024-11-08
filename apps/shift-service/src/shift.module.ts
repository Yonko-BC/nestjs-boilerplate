import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShiftRepository } from './repositories/shift.repository';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CosmosModule } from 'libs/core/src/database/cosmos/cosmos.module';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';
import { DatabaseConfig } from 'libs/core/src/config/database.config';
import {
  COSMOS_CONTAINERS_CONFIG,
  COSMOS_DATABASE_ID,
} from './config/cosmos.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/shift-service/.env',
      validate: (config) => {
        const validatedConfig = plainToClass(DatabaseConfig, config);
        const errors = validateSync(validatedConfig);
        if (errors.length > 0) {
          throw new Error(errors.toString());
        }
        return validatedConfig;
      },
    }),
    CosmosModule.forRoot({
      databaseId: COSMOS_DATABASE_ID,
      containerConfigs: COSMOS_CONTAINERS_CONFIG,
    }),
  ],
  providers: [ShiftRepository, ShiftService],
  controllers: [ShiftController],
})
export class ShiftModule {}
