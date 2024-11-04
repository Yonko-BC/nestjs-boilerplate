import { PAGINATION } from '../constants';

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationOptions {
  pageSize?: number;
  pageNumber?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, unknown>;
  continuationToken?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
  continuationToken?: string;
  hasMoreResults?: boolean;
  links?: {
    self: string;
    first: string;
    last: string;
    next?: string;
    prev?: string;
  };
}

export type NormalizedPaginationOptions = {
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filter?: Record<string, unknown>;
  continuationToken?: string;
};

export function normalizePaginationOptions(
  options?: PaginationOptions,
): NormalizedPaginationOptions {
  const defaultOptions: NormalizedPaginationOptions = {
    pageSize: 20,
    pageNumber: 1,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  };

  if (!options) {
    return defaultOptions;
  }

  return {
    pageSize: Math.min(Math.max(options.pageSize ?? 20, 1), 100),
    pageNumber: Math.max(options.pageNumber ?? 1, 1),
    sortBy: options.sortBy ?? 'createdAt',
    sortOrder: options.sortOrder ?? 'desc',
    filter: options.filter,
    continuationToken: options.continuationToken,
  };
}

export function calculatePaginationMeta(
  totalCount: number,
  options: Required<Pick<PaginationOptions, 'pageSize' | 'pageNumber'>>,
): PaginationMeta {
  const totalPages = Math.ceil(totalCount / options.pageSize);
  const currentPage = Math.min(options.pageNumber, totalPages || 1);

  return {
    currentPage,
    pageSize: options.pageSize,
    totalPages,
    totalCount,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}

export function buildPaginationLinks(
  baseUrl: string,
  meta: PaginationMeta,
  options: Required<
    Pick<PaginationOptions, 'pageSize' | 'pageNumber' | 'sortBy' | 'sortOrder'>
  >,
): PaginatedResult<never>['links'] {
  const buildUrl = (page: number) =>
    `${baseUrl}?pageSize=${options.pageSize}&pageNumber=${page}&sortBy=${options.sortBy}&sortOrder=${options.sortOrder}`;

  return {
    self: buildUrl(meta.currentPage),
    first: buildUrl(1),
    last: buildUrl(meta.totalPages),
    next: meta.hasNextPage ? buildUrl(meta.currentPage + 1) : undefined,
    prev: meta.hasPreviousPage ? buildUrl(meta.currentPage - 1) : undefined,
  };
}

// Optional: Type guard for pagination options
export function isValidPaginationOptions(
  options: unknown,
): options is PaginationOptions {
  if (!options || typeof options !== 'object') return false;

  const opts = options as PaginationOptions;

  if (
    opts.pageSize !== undefined &&
    (typeof opts.pageSize !== 'number' ||
      opts.pageSize < PAGINATION.MIN_PAGE_SIZE ||
      opts.pageSize > PAGINATION.MAX_PAGE_SIZE)
  )
    return false;

  if (
    opts.pageNumber !== undefined &&
    (typeof opts.pageNumber !== 'number' ||
      opts.pageNumber < PAGINATION.DEFAULT_PAGE)
  )
    return false;

  if (
    opts.sortOrder !== undefined &&
    opts.sortOrder !== 'asc' &&
    opts.sortOrder !== 'desc'
  )
    return false;

  return true;
}
