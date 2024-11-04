import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export function CatchCosmosError() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (error.code === 404) {
          throw new NotFoundException(error.message);
        }
        if (error.code === 409) {
          throw new ConflictException(error.message);
        }
        throw new InternalServerErrorException(
          `Cosmos DB operation failed: ${error.message}`,
        );
      }
    };
  };
}
