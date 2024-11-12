import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { transformKeys } from '../decorators/grpc-transform.decorator';
import { camelCase, snakeCase } from 'lodash';

@Injectable()
export class GrpcTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Get the RPC request data
    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData();

    // Transform incoming request from snake_case to camelCase
    const transformedData = transformKeys(data, camelCase);

    // Set the transformed data back to the context
    Object.assign(data, transformedData);

    // Handle the request and transform response to snake_case
    return next
      .handle()
      .pipe(map((response) => transformKeys(response, snakeCase)));
  }
}
