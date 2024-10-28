import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { setupSwagger } from './config/swagger.config';
import { HttpExceptionFilter } from 'libs/core/src/filters/http-exception.filter';
import { RpcExceptionFilter } from 'libs/core/src/filters/rpc-exception.filter';
import { CatchEverythingFilter } from 'libs/core/src/filters/catch-everything.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  setupSwagger(app);

  const httpAdapterHost = app.get(HttpAdapterHost);

  // Register global filters
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new RpcExceptionFilter());
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
