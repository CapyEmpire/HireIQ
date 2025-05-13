import { Controller, Get, Post, Body } from '@nestjs/common';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  getResults() {
    return this.resultsService.getResults();
  }

  @Post()
  saveResult(@Body() body: any) {
    // Flatten if it's a double array
    if (Array.isArray(body) && body.length === 1 && Array.isArray(body[0])) {
      this.resultsService.saveResults(body[0]); // Spread the inner array
    } else {
      this.resultsService.saveResults(body); // Normal save
    }

    return { status: 'ok' };
  }
}
