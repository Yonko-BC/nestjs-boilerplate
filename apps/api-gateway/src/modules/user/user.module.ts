import { Module } from '@nestjs/common';
import { UserProxy } from './user.proxy';

@Module({
  providers: [UserProxy],
  exports: [UserProxy],
})
export class UserModule {}
