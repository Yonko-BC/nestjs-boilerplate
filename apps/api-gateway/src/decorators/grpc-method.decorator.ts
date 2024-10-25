import { applyDecorators } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

export function GrpcMethodDecorator(service: string, method: string) {
  return applyDecorators(GrpcMethod(service, method));
}
