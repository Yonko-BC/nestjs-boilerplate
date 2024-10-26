import { CosmosClient } from '@azure/cosmos';

export function createCosmosConnection(
  endpoint: string,
  key: string,
): CosmosClient {
  return new CosmosClient({ endpoint, key });
}
