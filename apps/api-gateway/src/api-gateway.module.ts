import { Global, Module } from '@nestjs/common';
import { AppConfig } from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { GrpcModule } from './config/grpc.module';
import { ShiftModule } from './modules/shift/shift.module';

@Module({
  imports: [AppConfig, GrpcModule, AuthModule, UserModule, ShiftModule],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule {}
