import { ValueObject } from 'libs/core/src/domain/base.value-object';

export class Password extends ValueObject<string> {
  protected isValid(value: string): boolean {
    return value.length >= 6;
  }
}
