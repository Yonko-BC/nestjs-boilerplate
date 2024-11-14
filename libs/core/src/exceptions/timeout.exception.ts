import { HttpException, HttpStatus } from '@nestjs/common';

export class TimeoutException extends HttpException {
  constructor(
    public readonly operation: string,
    public readonly timeout: number,
    public readonly details?: Record<string, any>,
  ) {
    super(
      {
        code: HttpStatus.REQUEST_TIMEOUT,
        message: `Operation timed out after ${timeout}ms`,
        metadata: {
          type: 'TIMEOUT_ERROR',
          operation,
          timeout,
          details: process.env.NODE_ENV === 'development' ? details : undefined,
        },
      },
      HttpStatus.REQUEST_TIMEOUT,
    );
  }
}
