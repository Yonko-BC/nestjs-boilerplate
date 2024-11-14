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

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const httpAdapterHost = app.get(HttpAdapterHost);

  setupSwagger(app);

  // Global interceptors
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new TimeoutInterceptor(10000),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new ValidationException(errors),
    }),
  );

  // Order matters! More specific filters should come first
  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new CosmosExceptionFilter(),
    new CustomRpcExceptionFilter(), // This will handle RPC exceptions from microservices
    new CatchEverythingFilter(httpAdapterHost), // This should be last as fallback
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
