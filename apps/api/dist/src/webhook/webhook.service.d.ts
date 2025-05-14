export declare class WebhookService {
    private receivedData;
    storeWebhookData(data: {
        user_id: string;
        data: string;
    }): void;
    getStoredData(): {
        user_id: string;
        data: string;
        timestamp: Date;
    }[];
}
//# sourceMappingURL=webhook.service.d.ts.map