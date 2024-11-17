import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { status } from '@grpc/grpc-js';

@Catch()
export class ApiRpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiRpcExceptionFilter.name);

  private grpcStatusToHttp: Record<number, number> = {
    [status.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
    [status.FAILED_PRECONDITION]: HttpStatus.BAD_REQUEST,
    [status.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
    [status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
    [status.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
    [status.DEADLINE_EXCEEDED]: HttpStatus.REQUEST_TIMEOUT,
    [status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    this.logger.debug('Exception caught:', exception);

    let error: any;
    let httpStatus: number;
    let errorMessage: string;
    let errorDetails: any = {};

    try {
      // Handle RpcException
      if (exception instanceof RpcException) {
        error = exception.getError();
      }
      // Handle thrown gRPC error object
      else if (exception.code !== undefined) {
        error = exception;
      }
      // Handle other exceptions
      else {
        error = {
          code: status.INTERNAL,
          message: exception.message || 'Internal Server Error',
          metadata: {},
        };
      }

      httpStatus =
        this.grpcStatusToHttp[error.code] || HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = error.message || error.details || 'Internal Server Error';

      // Extract metadata
      const metadata = error.metadata?.toJSON?.() || error.metadata || {};

      errorDetails = {
        type: metadata.type?.[0] || 'INTERNAL_ERROR',
        ...metadata,
      };
    } catch (err) {
      this.logger.error('Error in exception filter:', err);
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = 'Internal Server Error';
    }

    this.logger.error({
      message: 'Request failed',
      path: request.url,
      error: {
        status: httpStatus,
        message: errorMessage,
        details: errorDetails,
      },
    });

    const errorResponse = {
      statusCode: httpStatus,
      message: errorMessage,
      error: errorDetails.type,
      details: errorDetails,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(httpStatus).json(errorResponse);
  }
}
