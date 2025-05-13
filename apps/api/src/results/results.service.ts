import { Injectable } from '@nestjs/common';

@Injectable()
export class ResultsService {
  private results = [];

  saveResults(newResults: any) {
    if (Array.isArray(newResults)) {
      this.results.push(...newResults); // Spread array of results
    } else {
      this.results.push(newResults); // Push single object
    }
  }

  getResults() {
    return this.results;
  }
}
