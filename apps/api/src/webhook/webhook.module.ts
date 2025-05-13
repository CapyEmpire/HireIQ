// webhook.module.ts
import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { ResultsModule } from '../results/results.module';  // Import the ResultsModule

@Module({
  imports: [ResultsModule],  // Add ResultsModule to imports
  controllers: [WebhookController],
})
export class WebhookModule {}
