import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from './grpc.config';

@Global()
@Module({
  imports: [ClientsModule.register(grpcClientOptions)],
  exports: [ClientsModule],
})
export class GrpcModule {}
