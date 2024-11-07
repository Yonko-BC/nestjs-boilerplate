import {
  Container,
  CosmosClient,
  StatusCodes,
  SqlQuerySpec,
  BulkOptions,
  BulkOperationType,
  StatusCodesType,
  ErrorResponse,
  JSONObject,
} from '@azure/cosmos';
import { HttpStatus } from '@nestjs/common';
import { CosmosException } from '../../exceptions/cosmos.exception';
import {
  PaginatedResult,
  PaginationOptions,
  NormalizedPaginationOptions,
  normalizePaginationOptions,
  calculatePaginationMeta,
  buildPaginationLinks,
} from '../../interfaces';
import { BaseEntity } from '../../domain/base.entity';
export abstract class BaseRepository<T extends BaseEntity> {
  protected container: Container;

  constructor(
    protected client: CosmosClient,
    protected databaseId: string,
    protected containerId: string,
  ) {
    this.container = this.client
      .database(this.databaseId)
      .container(this.containerId);
  }

  protected async executeCosmosOperation<R>(
    operation: string,
    action: () => Promise<R>,
  ): Promise<R> {
    try {
      return await action();
    } catch (error) {
      const cosmosError = error as {
        code: keyof StatusCodesType;
        message: string;
        requestId?: string;
        name?: string;
      };

      let statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

      if (cosmosError.code in StatusCodes) {
        statusCode = StatusCodes[cosmosError.code] as HttpStatus;
      } else {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      }

      const errorResponse: ErrorResponse = {
        name: cosmosError.name || 'CosmosError',
        code: StatusCodes[cosmosError.code],
        message: cosmosError.message,
        requestId: cosmosError.requestId,
      };

      throw new CosmosException(operation, errorResponse, statusCode);
    }
  }

  async create(item: Omit<T, keyof BaseEntity>): Promise<T> {
    return this.executeCosmosOperation('create', async () => {
      const timestamp = new Date().toISOString();
      const documentToCreate = {
        ...(item as T),
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const { resource } = await this.container.items.create(documentToCreate);
      console.log('resource', resource);
      return resource as T;
    });
  }

  async findById(id: string, partitionKey: string): Promise<T | null> {
    return this.executeCosmosOperation('findById', async () => {
      const { resource } = await this.container
        .item(id, partitionKey)
        .read<T>();
      return resource || null;
    });
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<T>> {
    return this.executeCosmosOperation('findAll', async () => {
      const normalizedOptions = normalizePaginationOptions(options);
      const query = this.buildPaginationQuery(normalizedOptions);

      const {
        resources: items,
        hasMoreResults,
        continuationToken,
      } = await this.container.items.query<T>(query).fetchAll();

      const totalCount = await this.getTotalCount();
      const meta = calculatePaginationMeta(totalCount, normalizedOptions);
      const links = buildPaginationLinks('/api/items', meta, normalizedOptions);

      return {
        items,
        meta,
        links,
        hasMoreResults,
        continuationToken,
      };
    });
  }

  async findManyBy(
    filter: Partial<T>,
    options?: PaginationOptions,
  ): Promise<PaginatedResult<T>> {
    return this.executeCosmosOperation('findManyBy', async () => {
      const normalizedOptions = normalizePaginationOptions(options);
      const query = this.buildFilterQuery(filter, normalizedOptions);

      const {
        resources: items,
        hasMoreResults,
        continuationToken,
      } = await this.container.items.query<T>(query).fetchAll();

      const totalCount = await this.getFilteredCount(filter);
      const meta = calculatePaginationMeta(totalCount, normalizedOptions);
      const links = buildPaginationLinks('/api/items', meta, normalizedOptions);

      return {
        items,
        meta,
        links,
        hasMoreResults,
        continuationToken,
      };
    });
  }

  async update(id: string, partitionKey: string, item: Partial<T>): Promise<T> {
    return this.executeCosmosOperation('update', async () => {
      const existing = await this.findById(id, partitionKey);
      if (!existing) {
        throw new CosmosException(
          'update',
          { message: 'Item not found', code: StatusCodes.NotFound },
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedItem = {
        ...existing,
        ...item,
        updatedAt: new Date().toISOString(),
      };

      const { resource } = await this.container
        .item(id, partitionKey)
        .replace(updatedItem);
      return resource as T;
    });
  }

  async delete(id: string, partitionKey: string): Promise<void> {
    await this.executeCosmosOperation('delete', () =>
      this.container.item(id, partitionKey).delete(),
    );
  }

  private buildPaginationQuery(
    options: NormalizedPaginationOptions,
  ): SqlQuerySpec {
    return {
      query:
        'SELECT * FROM c ORDER BY c.createdAt DESC OFFSET @offset LIMIT @limit',
      parameters: [
        {
          name: '@offset',
          value: (options.pageNumber - 1) * options.pageSize,
        },
        {
          name: '@limit',
          value: options.pageSize,
        },
      ],
    };
  }

  private buildFilterQuery(
    filter: Partial<T>,
    options: NormalizedPaginationOptions,
  ): SqlQuerySpec {
    const conditions = Object.entries(filter)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `c.${key} = @${key}`;
        }
        if (typeof value === 'boolean') {
          return `c.${key} = ${value}`;
        }
        if (Array.isArray(value)) {
          return `ARRAY_CONTAINS(@${key}, c.${key})`;
        }
        return `c.${key} = @${key}`;
      })
      .join(' AND ');

    const parameters = Object.entries(filter)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => ({
        name: `@${key}`,
        value,
      }));

    const orderBy = options.sortBy ? `c.${options.sortBy}` : 'c.createdAt';
    const orderDirection = options.sortOrder?.toUpperCase() || 'DESC';

    return {
      query: `SELECT * FROM c${
        conditions ? ` WHERE ${conditions}` : ''
      } ORDER BY ${orderBy} ${orderDirection} OFFSET @offset LIMIT @limit`,
      parameters: [
        ...parameters,
        {
          name: '@offset',
          value: (options.pageNumber - 1) * options.pageSize,
        },
        {
          name: '@limit',
          value: options.pageSize,
        },
      ],
    };
  }

  private async getTotalCount(): Promise<number> {
    const query = 'SELECT VALUE COUNT(1) FROM c';
    const { resources } = await this.container.items
      .query<number>(query)
      .fetchAll();
    return resources[0];
  }

  private async getFilteredCount(filter: Partial<T>): Promise<number> {
    const conditions = Object.entries(filter)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `c.${key} = @${key}`;
        }
        if (typeof value === 'boolean') {
          return `c.${key} = ${value}`;
        }
        if (Array.isArray(value)) {
          return `ARRAY_CONTAINS(@${key}, c.${key})`;
        }
        return `c.${key} = @${key}`;
      })
      .join(' AND ');

    const parameters = Object.entries(filter)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => ({
        name: `@${key}`,
        value,
      }));

    const query = {
      query: `SELECT VALUE COUNT(1) FROM c${
        conditions ? ` WHERE ${conditions}` : ''
      }`,
      parameters,
    };

    const { resources } = await this.container.items
      .query<number>(query)
      .fetchAll();
    return resources[0];
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    return this.executeCosmosOperation('findOne', async () => {
      const query = this.buildFilterQuery(filter, {
        pageNumber: 1,
        pageSize: 1,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      const { resources } = await this.container.items
        .query<T>(query)
        .fetchAll();
      return resources[0] || null;
    });
  }

  async exists(filter: Partial<T>): Promise<boolean> {
    return this.executeCosmosOperation('exists', async () => {
      const count = await this.getFilteredCount(filter);
      return count > 0;
    });
  }

  async upsert(item: T, partitionKey: string): Promise<T> {
    return this.executeCosmosOperation('upsert', async () => {
      const timestamp = new Date().toISOString();
      const documentToUpsert = {
        ...item,
        updatedAt: timestamp,
        partitionKey,
      };

      const { resource } = await this.container.items.upsert(documentToUpsert);
      return resource as unknown as T;
    });
  }

  async bulkCreate(items: Array<Omit<T, keyof BaseEntity>>): Promise<T[]> {
    return this.executeCosmosOperation('bulkCreate', async () => {
      const timestamp = new Date().toISOString();
      const operations = items.map((item) => ({
        operationType: BulkOperationType.Create,
        resourceBody: {
          ...(item as T),
          createdAt: timestamp,
          updatedAt: timestamp,
        } as unknown as JSONObject,
      }));

      const bulkOptions: BulkOptions = { continueOnError: false };
      const response = await this.container.items.bulk(operations, bulkOptions);

      // Handle potential errors in bulk response
      response.forEach((res) => {
        if (res.statusCode >= 400) {
          const errorResponse: ErrorResponse = {
            name: 'BulkOperationError',
            code: res.statusCode,
            message:
              (res.resourceBody as any)?.message || 'Bulk operation failed',
            requestId: (res as any)?.requestId,
          };
          throw new CosmosException(
            'bulkCreate',
            errorResponse,
            res.statusCode as HttpStatus,
          );
        }
      });

      return response.map((res) => res.resourceBody as unknown as T);
    });
  }

  async createMany(items: Array<Omit<T, keyof BaseEntity>>): Promise<T[]> {
    return this.executeCosmosOperation('createMany', async () => {
      const timestamp = new Date().toISOString();
      const operations = items.map((item) => ({
        operationType: BulkOperationType.Create,
        resourceBody: {
          ...item,
          createdAt: timestamp,
          updatedAt: timestamp,
        } as unknown as JSONObject,
      }));

      const bulkOptions: BulkOptions = { continueOnError: false };
      const response = await this.container.items.bulk(operations, bulkOptions);

      // Handle potential errors in bulk response
      response.forEach((res) => {
        if (res.statusCode >= 400) {
          const errorResponse: ErrorResponse = {
            name: 'BulkOperationError',
            code: res.statusCode,
            message:
              (res.resourceBody as any)?.message || 'Bulk operation failed',
            requestId: (res as any)?.requestId,
          };
          throw new CosmosException(
            'createMany',
            errorResponse,
            res.statusCode as HttpStatus,
          );
        }
      });

      return response.map((res) => res.resourceBody as unknown as T);
    });
  }
}
