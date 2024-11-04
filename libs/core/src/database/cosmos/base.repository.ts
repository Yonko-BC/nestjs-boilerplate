import {
  Container,
  CosmosClient,
  StatusCodes,
  SqlQuerySpec,
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
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      if (error.code === StatusCodes.NotFound) {
        statusCode = HttpStatus.NOT_FOUND;
      } else if (error.code === StatusCodes.Conflict) {
        statusCode = HttpStatus.CONFLICT;
      } else if (error.code === StatusCodes.TooManyRequests) {
        statusCode = HttpStatus.TOO_MANY_REQUESTS;
      }

      throw new CosmosException(operation, error, statusCode);
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
}
