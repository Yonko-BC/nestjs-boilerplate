export class BaseDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BaseDomainException';
  }
}

export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this.validate(value);
    this._value = value;
  }

  get value(): T {
    return this._value;
  }

  protected validate(value: T): void {
    if (!this.isValid(value)) {
      throw new BaseDomainException(
        `Invalid ${this.constructor.name} value: ${value}`,
      );
    }
  }

  protected abstract isValid(value: T): boolean;

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this._value) === JSON.stringify(vo._value);
  }
}
