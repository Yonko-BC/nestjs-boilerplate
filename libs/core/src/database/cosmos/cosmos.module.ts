import { Global, Module, OnApplicationShutdown } from '@nestjs/common';

import { cosmosProviders } from './cosmos.provider';
import { closeCosmosConnection } from './cosmos.connection';

@Global()
@Module({
  providers: [...cosmosProviders],
  exports: [...cosmosProviders],
})
export class CosmosModule implements OnApplicationShutdown {
  async onApplicationShutdown() {
    closeCosmosConnection();
  }
}
