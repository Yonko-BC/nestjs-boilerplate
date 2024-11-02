import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getCosmosConnection } from './cosmos.connection';

export const COSMOS_CLIENT = 'COSMOS_CLIENT';
export const DATABASE_ID = 'DATABASE_ID';
export const CONTAINER_CONFIGS = 'CONTAINER_CONFIGS';

export const cosmosProviders: Provider[] = [
  {
    provide: COSMOS_CLIENT,
    useFactory: async (configService: ConfigService) => {
      const endpoint = configService.get<string>('COSMOS_ENDPOINT');
      const key = configService.get<string>('COSMOS_KEY');
      const requestTimeout = configService.get<number>(
        'COSMOS_REQUEST_TIMEOUT',
      );
      const maxRetries = configService.get<number>('COSMOS_MAX_RETRIES');
      const retryInterval = configService.get<number>('COSMOS_RETRY_INTERVAL');
      const maxWaitTime = configService.get<number>('COSMOS_MAX_WAIT_TIME');

      if (!endpoint || !key) {
        throw new Error(
          'Missing required Cosmos DB configuration (endpoint or key)',
        );
      }

      return await getCosmosConnection(endpoint, key, {
        requestTimeout,
        maxRetries,
        retryInterval,
        maxWaitTime,
      });
    },
    inject: [ConfigService],
  },
  {
    provide: DATABASE_ID,
    useFactory: (configService: ConfigService) =>
      configService.get<string>('COSMOS_DATABASE_ID'),
    inject: [ConfigService],
  },
];
