import { ResultsService } from './results.service';
export declare class ResultsController {
    private readonly resultsService;
    constructor(resultsService: ResultsService);
    getResults(): any[];
    saveResult(body: any): {
        status: string;
    };
}
//# sourceMappingURL=results.controller.d.ts.map