import { validateSync, ValidationError } from 'class-validator';

export class ValidationException extends Error {
  constructor(public readonly errors: ValidationError[]) {
    super('Validation failed');
    this.name = 'ValidationException';
  }
}

export function validateEntity(entity: any): void {
  const errors = validateSync(entity, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    throw new ValidationException(errors);
  }
}
