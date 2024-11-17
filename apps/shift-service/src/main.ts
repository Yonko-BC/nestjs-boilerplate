import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { grpcConfig } from './config/grpc.config';
import { ShiftModule } from './shift.module';
import {
  CustomRpcExceptionFilter,
  ValidationExceptionFilter,
  CosmosExceptionFilter,
} from 'libs/core/src/filters';
import { ValidationException } from 'libs/core/src/exceptions/validation.exception';
import { GrpcTransformInterceptor } from 'libs/core/src/interceptors/grpc-transform.interceptor';

async function bootstrap() {
  const logger = new Logger('ShiftService');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ShiftModule,
    grpcConfig,
  );

  // Order matters! RpcExceptionFilter should be last as it's the most generic
  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new CosmosExceptionFilter(),
    new CustomRpcExceptionFilter(),
  );

  app.useGlobalInterceptors(new GrpcTransformInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new ValidationException(errors),
    }),
  );

  await app.listen();
  logger.log('Shift service is running on port 5005');
}
bootstrap();
