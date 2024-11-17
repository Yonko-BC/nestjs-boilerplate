import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';

export class DomainException extends RpcException {
  constructor(
    public readonly field: string,
    public readonly reason: string,
    public readonly value?: any,
  ) {
    const metadata = new Metadata();
    metadata.add('type', 'DOMAIN_ERROR');
    metadata.add('field', field);
    metadata.add('reason', reason);

    if (process.env.NODE_ENV === 'development' && value !== undefined) {
      metadata.add('value', JSON.stringify(value));
    }

    super({
      code: status.INVALID_ARGUMENT,
      message: `${field}: ${reason}`,
      metadata,
    });
  }
}
