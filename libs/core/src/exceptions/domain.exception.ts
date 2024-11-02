import { HttpException, HttpStatus } from '@nestjs/common';

export class DomainException extends HttpException {
  constructor(
    public readonly field: string,
    public readonly reason: string,
    public readonly value?: any,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        error: 'Domain Validation Error',
        field,
        reason,
        value: process.env.NODE_ENV === 'development' ? value : undefined,
        message: `${field}: ${reason}`,
        statusCode,
      },
      statusCode,
    );
  }
}
