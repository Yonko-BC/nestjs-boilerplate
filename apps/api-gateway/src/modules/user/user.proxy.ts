import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { SERVICE_NAMES } from 'libs/core/src/constants';
import {
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'libs/proto/user/generated/proto/user';

@Injectable()
export class UserProxy implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(
    @Inject(SERVICE_NAMES.USER_SERVICE) private userClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService =
      this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
  }
}
