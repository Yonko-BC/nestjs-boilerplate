import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { setupSwagger } from './config/swagger.config';
import { CosmosExceptionFilter } from 'libs/core/src/filters/cosmos-exception.filter';
import { ValidationExceptionFilter } from 'libs/core/src/filters/validation.filter';
import { ValidationException } from 'libs/core/src/exceptions/validation.exception';
import { ResponseInterceptor } from 'libs/core/src/interceptors/response.interceptor';
import { TimeoutInterceptor } from 'libs/core/src/interceptors/timeout.interceptor';
import { ValidationPipe } from '@nestjs/common';
import {
  CatchEverythingFilter,
  HttpExceptionFilter,
  RpcExceptionFilter,
} from 'libs/core/src/filters';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  setupSwagger(app);
  const httpAdapterHost = app.get(HttpAdapterHost);

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

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new RpcExceptionFilter());
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));

  // Global exception filters
  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new CosmosExceptionFilter(),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
