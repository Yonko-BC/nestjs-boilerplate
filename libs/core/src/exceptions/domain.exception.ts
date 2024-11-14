import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

export class DomainException extends RpcException {
  constructor(
    public readonly field: string,
    public readonly reason: string,
    public readonly value?: any,
  ) {
    super({
      code: status.INVALID_ARGUMENT,
      message: `${field}: ${reason}`,
      metadata: {
        type: 'DOMAIN_ERROR',
        field,
        reason,
        value: process.env.NODE_ENV === 'development' ? value : undefined,
        message: `${field}: ${reason}`,
        statusCode: status.INVALID_ARGUMENT,
      },
    });
  }
}
