import { snakeCase, camelCase } from 'lodash';

export function transformKeys(
  obj: any,
  transformer: (key: string) => string,
): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeys(item, transformer));
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const transformedKey = transformer(key);
      const value = obj[key];
      acc[transformedKey] = transformKeys(value, transformer);
      return acc;
    }, {} as any);
  }

  return obj;
}

export function GrpcToSnakeCase() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Transform request from snake_case to camelCase
      const transformedArgs = args.map((arg) => transformKeys(arg, camelCase));

      // Call the original method with camelCase args
      const result = await originalMethod.apply(this, transformedArgs);

      // Transform response to snake_case for gRPC
      return transformKeys(result, snakeCase);
    };

    return descriptor;
  };
}
