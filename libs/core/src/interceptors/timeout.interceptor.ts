import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { TimeoutException } from '../exceptions/timeout.exception';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly timeoutMs: number = 5000) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType();
    const request = context.switchToHttp().getRequest();
    const operationName = `${request.method} ${request.url}`;

    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new TimeoutException(operationName, this.timeoutMs, {
                contextType,
                path: request.url,
                method: request.method,
              }),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
