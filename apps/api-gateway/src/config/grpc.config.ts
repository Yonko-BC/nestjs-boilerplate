import { ClientsModuleOptions, Transport } from '@nestjs/microservices';

export const grpcClientOptions: ClientsModuleOptions = [
  {
    name: 'USER_PACKAGE',
    transport: Transport.GRPC,
    options: {
      url: 'localhost:5000',
      package: 'user',
      protoPath: 'proto/user.proto',
    },
  },
  {
    name: 'ORDER_PACKAGE',
    transport: Transport.GRPC,
    options: {
      url: 'localhost:5001',
      package: 'order',
      protoPath: 'proto/order.proto',
    },
  },
];
