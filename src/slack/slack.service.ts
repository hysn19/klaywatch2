import { Injectable } from '@nestjs/common';
import { IncomingWebhook } from '@slack/webhook';
import { logger } from 'config/winston';

@Injectable()
export class SlackService {
  private readonly webhook: IncomingWebhook;

  constructor() {
    this.webhook = new IncomingWebhook('https://hooks.slack.com/services/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');
  }

  async sendMessage(message: object) {
    try {
      await this.webhook.send(message);
      logger.info('Message sent successfully');
    } catch (error) {
      logger.error('Error occurred while sending to message:', error);
    }
    try {
      await this.webhook.send(message);
      logger.info('Message sent successfully');
    } catch (error) {
      logger.error('Error occurred while sending the message:', error);
    }
  }
}
