import { Injectable } from '@nestjs/common';
import { IncomingWebhook } from '@slack/webhook';
import { logger } from 'config/winston';

@Injectable()
export class SlackService {
    private readonly webhook: IncomingWebhook;

    constructor(webhookUrl: string) {
        this.webhook = new IncomingWebhook(webhookUrl);
    }

    async sendMessage(message: object) {
        await this.webhook.send(message);
        logger.info('Message sent successfully');
    } catch(error: { response: any; }) {
        logger.error('Error sending message:', error.response);
    }
}
