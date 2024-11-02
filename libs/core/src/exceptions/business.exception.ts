import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly details?: Record<string, any>,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        error: 'Business Rule Violation',
        code,
        message,
        details: process.env.NODE_ENV === 'development' ? details : undefined,
        statusCode,
      },
      statusCode,
    );
  }
}
