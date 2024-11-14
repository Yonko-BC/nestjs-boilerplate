import {
  ArgumentsHost,
  Catch,
  RpcExceptionFilter,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Observable, throwError } from 'rxjs';
import { ValidationException } from '../exceptions';

@Catch(RpcException)
export class CustomRpcExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError() as any;
    console.log('error in rpc exception filter:', exception);

    return throwError(() => ({
      code: error.code,
      message: error.message,
      metadata: error.metadata,
      details: error.details || error.message,
    }));
  }
}
