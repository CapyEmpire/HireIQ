import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';

@Module({
  controllers: [ResultsController], // ✅ This line was missing!
  providers: [ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}
