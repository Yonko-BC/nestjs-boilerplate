import { Module } from '@nestjs/common';
import { ShiftProxy } from './shift.proxy';
import { ShiftController } from './shift.controller';

@Module({
  controllers: [ShiftController],
  providers: [ShiftProxy],
  exports: [ShiftProxy],
})
export class ShiftModule {}
