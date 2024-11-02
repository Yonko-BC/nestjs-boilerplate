import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta?: Record<string, any>;
  timestamp: string;
  requestId: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.headers['x-request-id'];

    return next.handle().pipe(
      map((data) => ({
        data,
        meta: this.extractMeta(data),
        timestamp: new Date().toISOString(),
        requestId,
      })),
    );
  }

  private extractMeta(data: any): Record<string, any> | undefined {
    if (data && typeof data === 'object' && 'meta' in data) {
      const { meta, ...rest } = data;
      return meta;
    }
    return undefined;
  }
}
