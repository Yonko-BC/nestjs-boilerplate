import { HttpException, HttpStatus } from '@nestjs/common';

export class TimeoutException extends HttpException {
  constructor(
    public readonly operation: string,
    public readonly timeout: number,
    public readonly details?: Record<string, any>,
  ) {
    super(
      {
        error: 'Operation Timeout',
        operation,
        message: `Operation timed out after ${timeout}ms`,
        details: process.env.NODE_ENV === 'development' ? details : undefined,
        statusCode: HttpStatus.REQUEST_TIMEOUT,
      },
      HttpStatus.REQUEST_TIMEOUT,
    );
  }
}
