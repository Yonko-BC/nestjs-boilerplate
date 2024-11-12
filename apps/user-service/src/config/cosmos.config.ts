import { ContainerDefinition, PartitionKeyKind } from '@azure/cosmos';

export const COSMOS_DATABASE_ID = 'user-service';
export const COSMOS_CONTAINERS_CONFIG: ContainerDefinition[] = [
  {
    id: 'users',
    partitionKey: { paths: ['/departmentId'], kind: PartitionKeyKind.Hash },
    indexingPolicy: {
      indexingMode: 'consistent',
      includedPaths: [
        {
          path: '/createdAt/?',
          indexes: [
            {
              kind: 'Range',
              dataType: 'String',
            },
          ],
        },
        { path: '/fullName/?' },
        { path: '/departmentId/?' },
        { path: '/siteId/?' }, // Indexing the siteId for site-specific queries
        {
          path: '/roleId/?',
          indexes: [
            {
              kind: 'Range',
              dataType: 'String',
            },
          ],
        },
      ],
      excludedPaths: [
        { path: '/*' }, // Excludes all other paths not included explicitly
      ],
    },
    uniqueKeyPolicy: {
      uniqueKeys: [
        {
          paths: ['/employeeId'],
        },
      ],
    },
    // 30 days
    // defaultTtl: 2592000,
  },
];
