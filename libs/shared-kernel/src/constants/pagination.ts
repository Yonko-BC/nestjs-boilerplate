export const PAGINATION = {
  MIN_PAGE_SIZE: 1,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  DEFAULT_SORT_DIRECTION: 'desc' as const,
  MAX_SKIP_LIMIT: 1000,
  CONTINUATION_TOKEN_HEADER: 'x-continuation-token',
} as const;

// Type safety
export type PaginationConstants = typeof PAGINATION;
