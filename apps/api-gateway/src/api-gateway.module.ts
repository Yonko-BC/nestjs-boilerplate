import { Module } from '@nestjs/common';
import { AppConfig } from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from './config/grpc.config';

@Module({
  imports: [
    AppConfig,
    ClientsModule.register(grpcClientOptions),
    AuthModule,
    UserModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule {}
