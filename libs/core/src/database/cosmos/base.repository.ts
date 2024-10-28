import { Container, CosmosClient, SqlQuerySpec } from '@azure/cosmos';
import {
  buildPaginationLinks,
  calculatePaginationMeta,
  IRepository,
  normalizePaginationOptions,
  PaginatedResult,
  PaginationOptions,
} from 'libs/shared-kernel/src';
import { BaseEntity } from '../../domain/base.entity';

export class RepositoryError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly originalError: Error,
  ) {
    super(`Repository error during ${operation}: ${message}`);
    this.name = 'RepositoryError';
  }
}

export abstract class BaseRepository<T extends BaseEntity>
  implements IRepository<T>
{
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

  async create(item: Omit<T, keyof BaseEntity>): Promise<T> {
    const timestamp = new Date().toISOString();
    const documentToCreate: T = {
      ...(item as T),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const { resource } = await this.container.items.create(documentToCreate);
    return resource as T;
  }

  async findById(id: string, partitionKey: string): Promise<T | null> {
    try {
      const { resource } = await this.container
        .item(id, partitionKey)
        .read<T>();
      return resource || null;
    } catch (error) {
      if ((error as any).code === 404) return null;
      throw new RepositoryError(
        'Read operation failed',
        'findById',
        error as Error,
      );
    }
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<T>> {
    const normalizedOptions = normalizePaginationOptions(options);
    const query: SqlQuerySpec = {
      query:
        'SELECT * FROM c ORDER BY c.createdAt DESC OFFSET @offset LIMIT @limit',
      parameters: [
        {
          name: '@offset',
          value:
            (normalizedOptions.pageNumber - 1) * normalizedOptions.pageSize,
        },
        {
          name: '@limit',
          value: normalizedOptions.pageSize,
        },
      ],
    };

    const { resources: items, continuationToken } = await this.container.items
      .query<T>(query)
      .fetchAll();

    const totalCount = items.length;

    const meta = calculatePaginationMeta(totalCount, normalizedOptions);
    const links = buildPaginationLinks('/api/items', meta, normalizedOptions);

    return { items, meta, links, continuationToken }; // Include continuationToken
  }

  async update(id: string, partitionKey: string, item: Partial<T>): Promise<T> {
    const existing = await this.findById(id, partitionKey);
    if (!existing) {
      throw new RepositoryError(
        `Item with id ${id} not found`,
        'update',
        new Error('Not found'),
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
  }

  async delete(id: string, partitionKey: string): Promise<void> {
    await this.container.item(id, partitionKey).delete();
  }

  async findOneBy(filter: Partial<T>): Promise<T | null> {
    const query = this.buildFilterQuery(filter, 1);
    const { resources } = await this.container.items.query<T>(query).fetchAll();
    return resources[0] || null;
  }

  async findManyBy(
    filter: Partial<T>,
    options?: PaginationOptions,
  ): Promise<PaginatedResult<T>> {
    const normalizedOptions = normalizePaginationOptions(options);
    const query = this.buildFilterQuery(
      filter,
      normalizedOptions.pageSize,
      (normalizedOptions.pageNumber - 1) * normalizedOptions.pageSize,
    );

    const { resources: items } = await this.container.items
      .query<T>(query)
      .fetchAll();

    const totalCount = items.length;

    const meta = calculatePaginationMeta(totalCount, normalizedOptions);
    const links = buildPaginationLinks('/api/items', meta, normalizedOptions);

    return { items, meta, links };
  }

  private buildFilterQuery(
    filter: Partial<T>,
    limit: number,
    offset: number = 0,
  ): SqlQuerySpec {
    const conditions = Object.entries(filter)
      .map(([key, value]) => `c.${key} = @${key}`)
      .join(' AND ');

    const parameters = Object.entries(filter).map(([key, value]) => ({
      name: `@${key}`,
      value,
    }));

    return {
      query: `SELECT * FROM c${
        conditions ? ` WHERE ${conditions}` : ''
      } ORDER BY c.createdAt DESC OFFSET @offset LIMIT @limit`,
      parameters: [
        ...parameters,
        { name: '@offset', value: offset },
        { name: '@limit', value: limit },
      ],
    };
  }
}
