import { CosmosClient } from '@azure/cosmos';

let cosmosClient: CosmosClient | null = null;

export async function getCosmosConnection(
  endpoint: string,
  key: string,
  options?: {
    requestTimeout?: number;
    maxRetries?: number;
    retryInterval?: number;
    maxWaitTime?: number;
  },
) {
  if (!cosmosClient) {
    cosmosClient = new CosmosClient({
      endpoint,
      key,
      connectionPolicy: {
        requestTimeout: options?.requestTimeout,
        retryOptions: {
          maxRetryAttemptCount: options?.maxRetries,
          fixedRetryIntervalInMilliseconds: options?.retryInterval,
          maxWaitTimeInSeconds: options?.maxWaitTime,
        },
      },
    });
  }
  return cosmosClient;
}

export function closeCosmosConnection() {
  if (cosmosClient) {
    cosmosClient.dispose();
    cosmosClient = null;
  }
}
