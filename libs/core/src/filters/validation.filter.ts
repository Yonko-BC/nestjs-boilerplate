import {
  Catch,
  ArgumentsHost,
  Logger,
  RpcExceptionFilter,
} from '@nestjs/common';
import { ValidationException } from '../exceptions/validation.exception';
import { DomainException } from '../exceptions/domain.exception';
import { BusinessException } from '../exceptions';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
@Catch(ValidationException, DomainException, BusinessException)
export class ValidationExceptionFilter
  implements
    RpcExceptionFilter<
      ValidationException | DomainException | BusinessException
    >
{
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(
    exception: ValidationException | DomainException | BusinessException,
    host: ArgumentsHost,
  ): Observable<any> {
    const error = exception.getError() as any;

    // Use the metadata from the exception directly if it exists
    const metadata =
      error.metadata instanceof Metadata ? error.metadata : new Metadata();

    this.logger.error({
      message: 'Request validation failed',
      error: error,
      metadata: metadata,
    });

    return throwError(() => error);
  }
}
