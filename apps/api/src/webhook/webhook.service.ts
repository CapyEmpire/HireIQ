import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
  private receivedData: { user_id: string; data: string; timestamp: Date }[] = [];

  storeWebhookData(data: { user_id: string; data: string }) {
    const newData = {
      ...data,
      timestamp: new Date(),
    };
    this.receivedData.push(newData); // Storing the received data in memory
  }

  getStoredData() {
    return this.receivedData; // Retrieve the stored data
  }
}
