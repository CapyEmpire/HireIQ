import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { WebhookModule } from './webhook/webhook.module';
import { ResultsController } from './results/results.controller';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [LinksModule, WebhookModule, ResultsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
