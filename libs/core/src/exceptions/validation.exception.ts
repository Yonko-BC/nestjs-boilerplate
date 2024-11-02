import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends HttpException {
  constructor(errors: ValidationError[]) {
    const formattedErrors = ValidationException.formatErrors(errors);

    super(
      {
        error: 'Validation Error',
        details: formattedErrors,
        message: 'Request validation failed',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  private static formatErrors(
    errors: ValidationError[],
  ): Record<string, string[]> {
    return errors.reduce((acc, error) => {
      acc[error.property] = Object.values(error.constraints || {});
      return acc;
    }, {});
  }
}
