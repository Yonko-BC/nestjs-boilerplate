import { GrpcOptions, Transport } from '@nestjs/microservices';

export const grpcConfig: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    url: 'localhost:5000',
    package: 'user',
    protoPath: 'proto/user.proto',
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    },
    maxReceiveMessageLength: 1024 * 1024 * 100,
    maxSendMessageLength: 1024 * 1024 * 100,
  },
};
