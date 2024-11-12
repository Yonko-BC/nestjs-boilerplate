import { ClientsModuleOptions, Transport } from '@nestjs/microservices';
import { SERVICE_NAMES } from 'libs/core/src/constants';
import { join } from 'path';

export const grpcClientOptions: ClientsModuleOptions = [
  {
    name: SERVICE_NAMES.USER_SERVICE,
    transport: Transport.GRPC,
    options: {
      url: 'localhost:5000',
      package: 'user',
      protoPath: join(process.cwd(), 'proto/user.proto'),
      // loader: {
      //   keepCase: true,
      // },
    },
  },
  {
    name: SERVICE_NAMES.SHIFT_SERVICE,
    transport: Transport.GRPC,
    options: {
      url: 'localhost:5005',
      package: 'shift',
      protoPath: join(process.cwd(), 'proto/shift.proto'),
      // loader: {
      //   keepCase: true,
      // },
    },
  },
];
