import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FacebookService } from './facebook.service';
import { FacebookAuthService } from './facebook-auth.service';
import { FacebookController } from './facebook.controller';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [FacebookService, FacebookAuthService],
  controllers: [FacebookController],
  exports: [FacebookService],
})
export class FacebookModule {}