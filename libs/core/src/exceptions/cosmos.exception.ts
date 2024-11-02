import { HttpException, HttpStatus } from '@nestjs/common';
import {
  COSMOS_ERROR_MESSAGES,
  ERROR_CODES,
} from '../constants/error.constants';
import { IErrorResponse } from '../interfaces/error-response.interface';

export class CosmosException extends HttpException {
  constructor(
    public readonly operation: string,
    public readonly originalError: any,
    public readonly httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    const errorMessage = CosmosException.normalizeErrorMessage(originalError);
    const errorResponse: IErrorResponse = {
      error: 'Cosmos DB Error',
      operation,
      message: errorMessage,
      cosmosErrorCode: originalError.code,
      httpStatus,
      timestamp: new Date().toISOString(),
      details:
        process.env.NODE_ENV === 'development'
          ? originalError.message
          : undefined,
      requestId: originalError.requestId || undefined,
      statusCode: httpStatus,
      path: '', // Will be filled by filter
      method: '', // Will be filled by filter
    };

    super(errorResponse, httpStatus);
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
