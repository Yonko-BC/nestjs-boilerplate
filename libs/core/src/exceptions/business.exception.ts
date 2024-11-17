import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';

export class BusinessException extends RpcException {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly details?: Record<string, any>,
  ) {
    const metadata = new Metadata();
    metadata.add('type', 'BUSINESS_ERROR');
    metadata.add('code', code);

    if (details && process.env.NODE_ENV === 'development') {
      metadata.add('details', JSON.stringify(details));
    }

    super({
      code: status.FAILED_PRECONDITION,
      message,
      metadata,
    });
  }
}
