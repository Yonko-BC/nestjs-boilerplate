import { Transform, TransformFnParams } from 'class-transformer';

export function TransformDate() {
  return Transform(({ value }: TransformFnParams) => {
    if (value instanceof Date) return value;
    if (typeof value === 'string') return new Date(value);
    return null;
  });
}

export function TransformToString() {
  return Transform(({ value }: TransformFnParams) => {
    if (value === null || value === undefined) return '';
    return String(value);
  });
}
