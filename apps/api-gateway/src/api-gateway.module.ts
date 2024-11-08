import { Global, Module } from '@nestjs/common';
import { AppConfig } from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';
import { GrpcModule } from './config/grpc.module';

@Module({
  imports: [AppConfig, GrpcModule, AuthModule, UserModule, OrderModule],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule {}
