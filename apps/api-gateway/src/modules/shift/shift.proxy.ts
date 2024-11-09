import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  SHIFT_SERVICE_NAME,
  ShiftServiceClient,
} from 'libs/proto/shift/generated/proto/shift';

@Injectable()
export class ShiftProxy implements OnModuleInit {
  private shiftService: ShiftServiceClient;

  constructor(@Inject(SHIFT_SERVICE_NAME) private shiftClient: ClientGrpc) {}

  onModuleInit() {
    this.shiftService =
      this.shiftClient.getService<ShiftServiceClient>(SHIFT_SERVICE_NAME);
  }
}
