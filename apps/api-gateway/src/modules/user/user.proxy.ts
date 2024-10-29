import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import {
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'libs/proto/user/generated/user';

@Injectable()
export class UserProxy implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject(USER_SERVICE_NAME) private userClient: ClientGrpc) {}

  onModuleInit() {
    this.userService =
      this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
  }
}
