import { ContainerDefinition, PartitionKeyKind } from '@azure/cosmos';

export const COSMOS_DATABASE_ID = 'shift-service';
export const COSMOS_CONTAINERS_CONFIG: ContainerDefinition[] = [
  {
    id: 'shifts',
    partitionKey: { paths: ['/siteId'], kind: PartitionKeyKind.Hash },
    indexingPolicy: {
      indexingMode: 'consistent',
      includedPaths: [
        {
          path: '/siteId/?',
        },
        {
          path: '/startTime/?',
          indexes: [
            {
              kind: 'Range',
              dataType: 'String',
            },
          ],
        },
        {
          path: '/endTime/?',
          indexes: [
            {
              kind: 'Range',
              dataType: 'String',
            },
          ],
        },
        {
          path: '/status/?',
          indexes: [
            {
              kind: 'Range',
              dataType: 'Number',
            },
          ],
        },
        {
          path: '/teamLeadId/?',
          indexes: [
            {
              kind: 'Range',
              dataType: 'String',
            },
          ],
        },
        {
          path: '/shiftLeadId/?',
          indexes: [
            {
              kind: 'Range',
              dataType: 'String',
            },
          ],
        },
        {
          path: '/employeeIds/*',
          indexes: [
            {
              kind: 'Range',
              dataType: 'String',
            },
          ],
        },
        {
          path: '/isActive/?',
          indexes: [
            {
              kind: 'Range',
              dataType: 'String',
            },
          ],
        },
      ],
      excludedPaths: [
        { path: '/*' }, // Exclude everything by default
        { path: '/breaks/*' }, // Exclude break details from indexing
        { path: '/tags/*' }, // Exclude tags from indexing
        { path: '/metrics/*' }, // Exclude metrics from indexing
        { path: '/recurrence/*' }, // Exclude recurrence rules from indexing
      ],
    },
    uniqueKeyPolicy: {
      uniqueKeys: [
        {
          paths: ['/siteId', '/name'],
        },
      ],
    },
  },
];
