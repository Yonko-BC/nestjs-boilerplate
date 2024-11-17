import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { StatusCodes, ErrorResponse } from '@azure/cosmos';
import { Metadata } from '@grpc/grpc-js';

export class CosmosException extends RpcException {
  constructor(
    public readonly operation: string,
    public readonly originalError: ErrorResponse,
  ) {
    const errorMessage = CosmosException.normalizeErrorMessage(originalError);
    const metadata = new Metadata();
    metadata.add('type', 'COSMOS_ERROR');
    metadata.add('operation', operation);
    metadata.add('cosmosErrorCode', originalError.code?.toString() || '');

    if (originalError.requestId) {
      metadata.add('requestId', originalError.requestId);
    }

    const rpcError = {
      code: CosmosException.mapToRpcStatus(originalError.code),
      message: errorMessage,
      metadata,
    };

    super(rpcError);
  }

  private static mapToRpcStatus(cosmosCode: ErrorResponse['code']): status {
    switch (cosmosCode) {
      case StatusCodes.Conflict:
        return status.ALREADY_EXISTS;
      case StatusCodes.NotFound:
        return status.NOT_FOUND;
      case StatusCodes.BadRequest:
        return status.INVALID_ARGUMENT;
      case StatusCodes.TooManyRequests:
        return status.RESOURCE_EXHAUSTED;
      case StatusCodes.Forbidden:
        return status.PERMISSION_DENIED;
      case StatusCodes.Unauthorized:
        return status.UNAUTHENTICATED;
      case StatusCodes.PreconditionFailed:
        return status.FAILED_PRECONDITION;
      case StatusCodes.RequestTimeout:
        return status.DEADLINE_EXCEEDED;
      default:
        return status.INTERNAL;
    }
  }

  private static normalizeErrorMessage(error: ErrorResponse): string {
    return error.body?.message ?? error.message;
  }
}
