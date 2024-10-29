import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ORDER_SERVICE_NAME,
  OrderServiceClient,
} from 'libs/proto/order/generated/order';

@Injectable()
export class OrderProxy implements OnModuleInit {
  private orderService: OrderServiceClient;

  constructor(@Inject(ORDER_SERVICE_NAME) private orderClient: ClientGrpc) {}

  onModuleInit() {
    this.orderService =
      this.orderClient.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }
}
