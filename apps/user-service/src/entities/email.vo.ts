import { ValueObject } from 'libs/core/src/domain/base.value-object';

export class Email extends ValueObject<string> {
  protected isValid(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }
}
