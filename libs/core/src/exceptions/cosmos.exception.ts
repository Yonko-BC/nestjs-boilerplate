import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import {
  COSMOS_ERROR_MESSAGES,
  ERROR_CODES,
} from '../constants/error.constants';

export class CosmosException extends RpcException {
  constructor(
    public readonly operation: string,
    public readonly originalError: any,
  ) {
    const errorMessage = CosmosException.normalizeErrorMessage(originalError);
    const metadata = {
      type: 'COSMOS_ERROR',
      operation,
      cosmosErrorCode: originalError.code,
      requestId: originalError.requestId,
      details:
        process.env.NODE_ENV === 'development'
          ? originalError.message
          : undefined,
    };

    const rpcError = {
      code: CosmosException.mapToRpcStatus(originalError.code),
      message: errorMessage,
      metadata,
    };

    super(rpcError);
  }

  private static mapToRpcStatus(cosmosCode: number): status {
    switch (cosmosCode) {
      case ERROR_CODES.COSMOS.NOT_FOUND:
        return status.NOT_FOUND;
      case ERROR_CODES.COSMOS.CONFLICT:
        return status.ALREADY_EXISTS;
      case ERROR_CODES.COSMOS.RATE_LIMIT:
        return status.RESOURCE_EXHAUSTED;
      default:
        return status.INTERNAL;
    }
  }

  private static normalizeErrorMessage(error: any): string {
    const message = error.message || 'Unknown database error';

    // Map known error codes to friendly messages
    if (error.code === ERROR_CODES.COSMOS.CONFLICT) {
      return COSMOS_ERROR_MESSAGES.DUPLICATE_ENTITY;
    }
    if (error.code === ERROR_CODES.COSMOS.NOT_FOUND) {
      return COSMOS_ERROR_MESSAGES.NOT_FOUND;
    }
    if (error.code === ERROR_CODES.COSMOS.RATE_LIMIT) {
      return COSMOS_ERROR_MESSAGES.RATE_LIMIT_EXCEEDED;
    }

    return message.split(',')[0].trim();
  }
}
