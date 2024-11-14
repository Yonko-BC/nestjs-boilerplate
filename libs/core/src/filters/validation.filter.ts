import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from '../exceptions/validation.exception';
import { DomainException } from '../exceptions/domain.exception';
import { v4 as uuidv4 } from 'uuid';
import { BusinessException } from '../exceptions';
import { throwError } from 'rxjs';
@Catch(ValidationException, DomainException, BusinessException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(
    exception: ValidationException | DomainException | BusinessException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const requestId = request.headers['x-request-id'] || uuidv4();

    const errorResponse = {
      // statusCode: exception.getStatus(),
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      requestId,
      ...(exception.getError() as Record<string, any>),
    };

    // console.log('errorResponse:', errorResponse);

    // Structured logging
    this.logger.error({
      message: 'Validation error',
      requestId,
      path: request.url,
      method: request.method,
      errors: errorResponse,
    });

    return throwError(() => ({
      error: exception.getError(),
      metadata: errorResponse,
    }));
  }
}
