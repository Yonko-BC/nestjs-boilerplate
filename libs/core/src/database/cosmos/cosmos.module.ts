// import { Global, Module, OnApplicationShutdown } from '@nestjs/common';

// import { cosmosProviders } from './cosmos.provider';
// import { closeCosmosConnection } from './cosmos.connection';
// import { ConfigModule } from '@nestjs/config';
// import { CosmosDatabaseSynchronizationService } from './cosmos-database-sync.service';

// @Global()
// @Module({
//   imports: [ConfigModule],
//   providers: [...cosmosProviders, CosmosDatabaseSynchronizationService],
//   exports: [...cosmosProviders, CosmosDatabaseSynchronizationService],
// })
// export class CosmosModule implements OnApplicationShutdown {
//   async onApplicationShutdown() {
//     closeCosmosConnection();
//   }
// }

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

interface CosmosModuleOptions {
  databaseId: string;
  containerConfigs: { id: string; partitionKey: string }[];
}

@Global()
@Module({})
export class CosmosModule implements OnApplicationShutdown {
  async onApplicationShutdown() {
    closeCosmosConnection();
  }

  static forRoot(options: CosmosModuleOptions): DynamicModule {
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
