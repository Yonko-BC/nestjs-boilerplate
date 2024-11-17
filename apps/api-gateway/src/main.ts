import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';
import { setupSwagger } from './config/swagger.config';
import {
  CustomRpcExceptionFilter,
  CosmosExceptionFilter,
  ValidationExceptionFilter,
  CatchEverythingFilter,
} from 'libs/core/src/filters';
import { ValidationException } from 'libs/core/src/exceptions/validation.exception';
import { ResponseInterceptor } from 'libs/core/src/interceptors/response.interceptor';
import { TimeoutInterceptor } from 'libs/core/src/interceptors/timeout.interceptor';
import { ApiRpcExceptionFilter } from 'libs/core/src/filters/api-rpc-exception.filter';
import { HttpExceptionFilter } from 'libs/core/src/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const httpAdapterHost = app.get(HttpAdapterHost);

  setupSwagger(app);

  // Global interceptors
  app.useGlobalInterceptors(
    new TimeoutInterceptor(10000),
    new ResponseInterceptor(),
  );

  // Only use ApiRpcExceptionFilter as it will handle all exceptions
  app.useGlobalFilters(new ApiRpcExceptionFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new ValidationException(errors),
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
