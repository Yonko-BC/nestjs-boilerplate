import { ContainerDefinition, PartitionKeyKind } from '@azure/cosmos';

export const COSMOS_CONTAINERS_CONFIG: ContainerDefinition[] = [
  {
    id: 'users',
    partitionKey: {
      paths: ['/id'],
      kind: PartitionKeyKind.Hash,
    },
    uniqueKeyPolicy: {
      uniqueKeys: [
        {
          paths: ['/email'],
        },
      ],
    },
  },
  {
    id: 'roles',
    partitionKey: {
      paths: ['/id'],
      kind: PartitionKeyKind.Hash,
    },
  },
];
