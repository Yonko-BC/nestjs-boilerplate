import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class CustomRpcExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  private readonly logger = new Logger(CustomRpcExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError() as any;

    this.logger.error({
      message: 'RPC exception caught',
      error: error,
    });

    return throwError(() => ({
      code: error.code,
      message: error.message,
      metadata: error.metadata,
    }));
  }
}
