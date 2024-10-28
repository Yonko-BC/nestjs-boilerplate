import { CosmosClient, CosmosClientOptions } from '@azure/cosmos';

let cosmosClient: CosmosClient | null = null;

export function getCosmosConnection(
  endpoint: string,
  key: string,
): CosmosClient {
  if (!cosmosClient) {
    const options: CosmosClientOptions = {
      endpoint,
      key,
      connectionPolicy: {
        requestTimeout: 30000,
        retryOptions: {
          maxRetryAttemptCount: 3,
          fixedRetryIntervalInMilliseconds: 1000,
          maxWaitTimeInSeconds: 60,
        },
      },
    };
    cosmosClient = new CosmosClient(options);
  }
  return cosmosClient;
}

export function closeCosmosConnection(): void {
  if (cosmosClient) {
    cosmosClient.dispose();
    cosmosClient = null;
  }
}
