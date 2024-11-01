import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import {
  cosmosProviders,
  DATABASE_ID,
  CONTAINER_CONFIGS,
} from './cosmos.provider';
import { closeCosmosConnection } from './cosmos.connection';
import { DatabaseInitializer } from './cosmos-database-sync.service';
import { ContainerDefinition } from '@azure/cosmos';

interface CosmosModuleOptions {
  databaseId: string;
  containerConfigs: ContainerDefinition[];
}

@Global()
@Module({})
export class CosmosModule implements OnApplicationShutdown {
  async onApplicationShutdown() {
    closeCosmosConnection();
  }

  static forRoot(options: CosmosModuleOptions): DynamicModule {
    if (!options.databaseId || !Array.isArray(options.containerConfigs)) {
      throw new Error(
        'Invalid Cosmos DB configuration: Missing database ID or container configuration.',
      );
    }

    const providers = [
      ...cosmosProviders,
      {
        provide: DATABASE_ID,
        useValue: options.databaseId,
      },
      {
        provide: CONTAINER_CONFIGS,
        useValue: options.containerConfigs,
      },
      DatabaseInitializer,
    ];

    return {
      module: CosmosModule,
      providers: providers,
      exports: providers,
    };
  }
}
