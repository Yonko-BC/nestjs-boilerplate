import { BaseException } from './base.exception';
import { ErrorCode } from '../enums';

export class NotFoundException extends BaseException {
  constructor(message: string) {
    super(message, ErrorCode.NOT_FOUND);
  }
}
