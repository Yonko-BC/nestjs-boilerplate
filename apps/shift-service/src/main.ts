import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { grpcConfig } from './config/grpc.config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { CosmosExceptionFilter } from 'libs/core/src/filters/cosmos-exception.filter';
import { ValidationExceptionFilter } from 'libs/core/src/filters/validation.filter';
import { ValidationException } from 'libs/core/src/exceptions/validation.exception';
import { ResponseInterceptor } from 'libs/core/src/interceptors/response.interceptor';
import { TimeoutInterceptor } from 'libs/core/src/interceptors/timeout.interceptor';
import { ShiftModule } from './shift.module';
import { GrpcTransformInterceptor } from 'libs/core/src/interceptors/grpc-transform.interceptor';

async function bootstrap() {
  const logger = new Logger('ShiftService');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ShiftModule,
    grpcConfig,
  );

  app.useGlobalInterceptors(new GrpcTransformInterceptor());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new ValidationException(errors),
    }),
  );

  // Global exception filters
  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new CosmosExceptionFilter(),
  );

  await app.listen();
  logger.log('Shift service is running on port 5005');
}
bootstrap();
