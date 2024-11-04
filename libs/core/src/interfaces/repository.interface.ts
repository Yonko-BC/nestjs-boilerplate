import { BaseEntity } from 'libs/core/src';
import { PaginationOptions, PaginatedResult } from './pagination.interface';

export interface IRepository<T extends BaseEntity> {
  create(item: Omit<T, keyof BaseEntity>): Promise<T>;
  findById(id: string, partitionKey: string): Promise<T | null>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<T>>;
  update(id: string, partitionKey: string, item: Partial<T>): Promise<T>;
  delete(id: string, partitionKey: string): Promise<void>;
  findOneBy(filter: Partial<T>): Promise<T | null>;
  findManyBy(
    filter: Partial<T>,
    options?: PaginationOptions,
  ): Promise<PaginatedResult<T>>;
}
