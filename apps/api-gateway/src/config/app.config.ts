import { ConfigModule } from '@nestjs/config';

export const AppConfig = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
});
