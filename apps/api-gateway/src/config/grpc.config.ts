import { ClientsModuleOptions, Transport } from '@nestjs/microservices';

import { SHIFT_SERVICE_NAME } from 'libs/proto/shift/generated/proto/shift';
import { USER_SERVICE_NAME } from 'libs/proto/user/generated/proto/user';

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
    name: SHIFT_SERVICE_NAME,
    transport: Transport.GRPC,
    options: {
      url: 'localhost:5005',
      package: 'shift',
      protoPath: 'proto/shift.proto',
    },
  },
];
