import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { ValidationError } from 'class-validator';
import { Metadata } from '@grpc/grpc-js';
export class ValidationException extends RpcException {
  constructor(errors: ValidationError[]) {
    const formattedErrors = ValidationException.formatErrors(errors);

    const metadata = new Metadata();
    metadata.add('type', 'VALIDATION_ERROR');
    metadata.add('details', JSON.stringify(formattedErrors));
    metadata.add('timestamp', new Date().toISOString());

    super({
      code: status.INVALID_ARGUMENT,
      message: 'Validation failed',
      metadata: metadata,
    });
  }

  private static formatErrors(
    errors: ValidationError[],
  ): Record<string, string[]> {
    return errors.reduce(
      (acc, error) => {
        acc[error.property] = Object.values(error.constraints || {});
        return acc;
      },
      {} as Record<string, string[]>,
    );
  }
}
