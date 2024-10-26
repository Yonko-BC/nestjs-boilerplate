import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export abstract class BaseGrpcController {
  @GrpcMethod()
  protected handleRequest(data: any): Promise<any> {
    return this.implementHandleRequest(data);
  }

  protected abstract implementHandleRequest(data: any): Promise<any>;
}
