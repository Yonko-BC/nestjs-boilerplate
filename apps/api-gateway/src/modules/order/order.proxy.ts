import { Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class OrderProxy {
  constructor(private client: ClientGrpc) {}

  // Implement order-related proxy methods here
}
