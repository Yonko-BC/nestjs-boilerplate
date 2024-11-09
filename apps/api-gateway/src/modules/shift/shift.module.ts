import { Module } from '@nestjs/common';
import { ShiftProxy } from './shift.proxy';

@Module({
  providers: [ShiftProxy],
  exports: [ShiftProxy],
})
export class ShiftModule {}
