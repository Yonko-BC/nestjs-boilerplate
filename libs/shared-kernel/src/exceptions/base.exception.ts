import { ErrorCode } from '../enums';

export class BaseException extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
