import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { SlackService } from '../slack/slack.service';
import { CaverService } from '../klaytn/caver/caver.service';
import { SlackMessage } from '../slack/slack.message';
import { logger } from 'config/winston';

@Injectable()
export class TaskService {
  private slackService = new SlackService(
    'https://hooks.slack.com/services/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',
  );
  private caverService = new CaverService(
    'https://public-node-api.klaytnapi.com/v1/cypress',
  );

  private isCronJobActive = false;

  private async getAccountByCaverAndSendSlack(
    accountAddress: string,
    accountName: string,
  ) {
    const [currentBalance, transactionCount, currentBlockNumber] =
      await Promise.all([
        this.caverService.getBalance(accountAddress),
        this.caverService.getTransactionCount(accountAddress),
        this.caverService.getCurrentBlockNumber(),
      ]);

    logger.info(`balance: ${currentBalance}`);
    logger.info(`transactionCount: ${transactionCount}`);
    logger.info(`currentBlockNumber: ${currentBlockNumber}`);

    const message = new SlackMessage(
      accountAddress,
      accountName,
      currentBalance,
      transactionCount,
      currentBlockNumber,
      this.isAnomalyDetected(accountAddress, currentBalance, transactionCount),
    ).payload;

    await this.slackService.sendMessage(message);
  }

  @Cron('0 0 * * * *') // runs every hour at the 0 minute.
  async handleCron1() {
    this.isCronJobActive = true;

    const accountAddress = '0x2fd3ff6e4ead7430ea25bab5e5b2b073492b7e6e';
    const accountName = 'Reward: Kakao Pay 3';

    await this.getAccountByCaverAndSendSlack(accountAddress, accountName);
  }

  @Cron('0 0/10 * * * *') // run every 10 minutes
  async handleCron2() {
    this.isCronJobActive = true;

    const accountAddress = '0x1f55eadcc398e9a2d3b8b505c993e19d210786bf';
    const accountName = 'Reward: Kakao Pay';

    await this.getAccountByCaverAndSendSlack(accountAddress, accountName);
  }

  @Cron('0 0 0 * * *') // run every midnight
  async handleCron3() {
    this.isCronJobActive = true;

    const array = [
      {
        accountAddress: '0x2888d9dcbd6cefb92a76712eca61391c37df8122',
        accountName: 'StakingV1 Account',
      },
      {
        accountAddress: '0x4Ff8B6c558cBA6b20c962F301908D1D70cEEEA7c',
        accountName: 'StakingV2 Account',
      },
      {
        accountAddress: '0xbe02aba56bae1624e2c4f029e3a79308e2a19e98',
        accountName: 'AuthFee Account',
      },
      {
        accountAddress: '0x020794caf06273ef3a9b4b0323c72341ec070b15',
        accountName: 'Reward1 Account',
      },
    ];

    await Promise.all(
      array.map(async (account) => {
        await this.getAccountByCaverAndSendSlack(
          account.accountAddress,
          account.accountName,
        );
      }),
    );
  }

  isAnomalyDetected(
    accountAddress: string,
    currentBalance: number,
    transactionCount: number,
  ): boolean {
    if (accountAddress === '0x1f55eadcc398e9a2d3b8b505c993e19d210786bf') {
      return currentBalance !== 18721282.982378695 || transactionCount > 0;
    }
    return false;
  }

  isCronJobRunning(): boolean {
    return this.isCronJobActive;
  }
}
