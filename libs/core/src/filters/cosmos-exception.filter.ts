import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { CosmosException } from '../exceptions/cosmos.exception';
import { status } from '@grpc/grpc-js';
import { Metadata } from '@grpc/grpc-js';

@Catch(CosmosException)
export class CosmosExceptionFilter
  implements RpcExceptionFilter<CosmosException>
{
  private readonly logger = new Logger(CosmosExceptionFilter.name);

  catch(exception: CosmosException, host: ArgumentsHost): Observable<any> {
    const errorResponse = exception.originalError;

    // Create gRPC metadata
    const metadata = new Metadata();
    metadata.add('type', 'COSMOS_ERROR');
    metadata.add('operation', exception.operation);
    metadata.add('cosmosErrorCode', errorResponse.code?.toString() || '');
    metadata.add('timestamp', new Date().toISOString());

    if (errorResponse.requestId) {
      metadata.add('requestId', errorResponse.requestId);
    }

    // Log the error
    this.logger.error({
      message: `Cosmos DB error during ${exception.operation}`,
      errorCode: errorResponse.code,
      errorMessage: errorResponse.message,
      details: errorResponse,
    });

    // Create gRPC error object
    const error = {
      code: status.INTERNAL, // You can map Cosmos status codes to gRPC status codes
      message: errorResponse.message,
      metadata,
    };

    // Return RPC error response
    return throwError(() => error);
  }
}
