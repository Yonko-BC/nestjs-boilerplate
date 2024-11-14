import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { ValidationError } from 'class-validator';

export class ValidationException extends RpcException {
  constructor(errors: ValidationError[]) {
    const formattedErrors = ValidationException.formatErrors(errors);

    console.log('formattedErrors', formattedErrors);

    super({
      code: 320870,
      message: 'Request validation failed ..dd...',
      metadata: {
        type: 'VALIDATION_ERROR',
        details: formattedErrors,
      },
    });
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
