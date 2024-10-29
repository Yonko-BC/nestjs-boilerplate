import { ClientsModuleOptions, Transport } from '@nestjs/microservices';
import { ORDER_SERVICE_NAME } from 'libs/proto/order/generated/order';
import { USER_SERVICE_NAME } from 'libs/proto/user/generated/user';

export const grpcClientOptions: ClientsModuleOptions = [
  {
    name: USER_SERVICE_NAME,
    transport: Transport.GRPC,
    options: {
      url: 'localhost:5000',
      package: 'user',
      protoPath: 'proto/user.proto',
    },
  },
  {
    name: ORDER_SERVICE_NAME,
    transport: Transport.GRPC,
    options: {
      url: 'localhost:5001',
      package: 'order',
      protoPath: 'proto/order.proto',
    },
  },
];
