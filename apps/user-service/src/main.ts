import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { grpcConfig } from './config/grpc.config';

async function bootstrap() {
  const logger = new Logger('UserService');

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   UserModule,
  //   grpcConfig,
  // );

  const app = await NestFactory.create(UserModule);

  await app.listen(3000);

  // logger.log(`User service is listening on ${grpcConfig.options.url}`);
}
bootstrap();
