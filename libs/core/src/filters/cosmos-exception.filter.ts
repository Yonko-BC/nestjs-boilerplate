import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { CosmosException } from '../exceptions/cosmos.exception';
import { IErrorResponse } from '../interfaces/error-response.interface';
import { v4 as uuidv4 } from 'uuid';

@Catch(CosmosException)
export class CosmosExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CosmosExceptionFilter.name);

  catch(exception: CosmosException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const requestId = request.headers['x-request-id'] || uuidv4();

    // Get the error response from the exception
    const errorResponse = exception.getResponse() as IErrorResponse;

    // Enhance the error response
    const enhancedErrorResponse: IErrorResponse = {
      ...errorResponse,
      path: request.url,
      method: request.method,
      requestId,
      timestamp: new Date().toISOString(),
    };

    // Remove undefined/null properties
    Object.keys(enhancedErrorResponse).forEach(
      (key) =>
        (enhancedErrorResponse[key] === undefined ||
          enhancedErrorResponse[key] === null) &&
        delete enhancedErrorResponse[key],
    );

    // Structured logging
    this.logger.error({
      message: `Cosmos DB error during ${exception.operation}`,
      requestId,
      path: request.url,
      method: request.method,
      errorCode: errorResponse.cosmosErrorCode,
      errorMessage: errorResponse.message,
      details:
        process.env.NODE_ENV === 'development'
          ? exception.originalError
          : undefined,
    });

    response
      .status(exception.getStatus())
      .set('X-Request-ID', requestId)
      .json(enhancedErrorResponse);
  }
}
