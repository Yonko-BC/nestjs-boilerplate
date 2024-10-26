export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = value;
    this.validate();
  }

  abstract validate(): void;

  equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this._value) === JSON.stringify(vo._value);
  }

  get value(): T {
    return this._value;
  }
}
