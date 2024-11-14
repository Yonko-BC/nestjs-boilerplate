import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

export class BusinessException extends RpcException {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly details?: Record<string, any>,
  ) {
    super({
      code: 320860,
      message,
      metadata: {
        type: 'BUSINESS_ERROR',
        code,
        details: process.env.NODE_ENV === 'development' ? details : undefined,
      },
    });
  }
}
