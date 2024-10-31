import { CosmosClient, CosmosClientOptions } from '@azure/cosmos';

interface ConnectionOptions {
  requestTimeout?: number;
  maxRetries?: number;
  retryInterval?: number;
  maxWaitTime?: number;
}

let cosmosClient: CosmosClient | null = null;

export async function getCosmosConnection(
  endpoint: string,
  key: string,
  databaseId?: string,
  options?: ConnectionOptions,
): Promise<CosmosClient> {
  if (!cosmosClient) {
    console.log('Connecting to Cosmos DB...');
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
    try {
      if (databaseId) {
        await cosmosClient.database(databaseId).read(); // Verifies connection
        console.log('Connected to Cosmos DB');
      }
    } catch (error) {
      cosmosClient = null; // Reset client on failure
      throw new Error(`Failed to connect to Cosmos DB: ${error.message}`);
    }
  }
  return cosmosClient;
}

export function closeCosmosConnection(): void {
  if (cosmosClient) {
    cosmosClient.dispose();
    cosmosClient = null;
    console.log('Cosmos DB connection closed');
  }
}
