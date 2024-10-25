import { Module } from '@nestjs/common';
import { OrderProxy } from './order.proxy';

@Module({
  providers: [OrderProxy],
  exports: [OrderProxy],
})
export class OrderModule {}
