export const COSMOS_ERROR_MESSAGES = {
  DUPLICATE_ENTITY: 'Entity already exists',
  NOT_FOUND: 'Entity not found',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  PARTITION_KEY_MISMATCH: 'Invalid partition key',
} as const;

export const ERROR_CODES = {
  COSMOS: {
    CONFLICT: 409,
    NOT_FOUND: 404,
    RATE_LIMIT: 429,
    PARTITION_KEY: 400,
  },
} as const;
