import { Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class UserProxy {
  constructor(private client: ClientGrpc) {}

  // Implement user-related proxy methods here
}
