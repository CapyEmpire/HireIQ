// webhook.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ResultsService } from '../results/results.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post('tavus')
  handleTavusWebhook(@Body() body: any) {
    this.resultsService.saveResults(body);
    return { message: 'Webhook received successfully' };
  }
}
