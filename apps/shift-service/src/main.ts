import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CosmosExceptionFilter } from 'libs/core/src/filters/cosmos-exception.filter';
import { ValidationExceptionFilter } from 'libs/core/src/filters/validation.filter';
import { ValidationException } from 'libs/core/src/exceptions/validation.exception';
import { ResponseInterceptor } from 'libs/core/src/interceptors/response.interceptor';
import { TimeoutInterceptor } from 'libs/core/src/interceptors/timeout.interceptor';
import { v4 as uuidv4 } from 'uuid';
import { grpcConfig } from './config/grpc.config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ShiftModule } from './shift.module';

async function bootstrap() {
  const logger = new Logger('ShiftService');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ShiftModule,
    grpcConfig,
  );

  // Global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor(10000)); // 10s timeout

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

  // await app.listen(3000);
  await app.listen();
  logger.log('Shift service is running');
}
bootstrap();
