import { ResultsService } from '../results/results.service';
export declare class WebhookController {
    private readonly resultsService;
    constructor(resultsService: ResultsService);
    handleTavusWebhook(body: any): {
        message: string;
    };
}
//# sourceMappingURL=webhook.controller.d.ts.map