import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // If it's an error response from gRPC
        if (
          data &&
          typeof data === 'object' &&
          'code' in data &&
          data.code !== 0
        ) {
          this.logger.debug('Throwing gRPC error response:', data);
          throw data;
        }

        // Normal successful response
        return {
          data,
          timestamp: new Date().toISOString(),
          requestId: uuidv4(),
        };
      }),
      catchError((error) => {
        this.logger.debug('Error caught in interceptor:', error);
        return throwError(() => error);
      }),
    );
  }
}
