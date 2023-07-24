import { Injectable, HttpService } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SlackService } from '../slack/slack.service';
import { CaverService } from '../klaytn/caver/caver.service';
import { SlackMessage } from '../slack/slack.message';
import { logger } from 'config/winston';
import { CronJob } from './custom.decorator';

@Injectable()
export class TaskService {
  private isCronJobActive = false;
  private readonly tasks: Task[];

  constructor(
    private readonly slackService: SlackService,
    private readonly caverService: CaverService,
    private readonly httpService: HttpService, // Assuming you need to use HttpService for API calls
  ) {
    this.tasks = [
      new Task(
        '0x2fd3ff6e4ead7430ea25bab5e5b2b073492b7e6e',
        'Reward: Kakao Pay 3',
      ),
      new Task(
        '0x1f55eadcc398e9a2d3b8b505c993e19d210786bf',
        'Reward: Kakao Pay',
      ),
      new Task(
        '0x2888d9dcbd6cefb92a76712eca61391c37df8122',
        'StakingV1 Account',
      ),
      new Task(
        '0x4Ff8B6c558cBA6b20c962F301908D1D70cEEEA7c',
        'StakingV2 Account',
      ),
      new Task('0xbe02aba56bae1624e2c4f029e3a79308e2a19e98', 'AuthFee Account'),
      new Task('0x020794caf06273ef3a9b4b0323c72341ec070b15', 'Reward1 Account'),
    ];
  }

  private async getAccountByCaverAndSendSlack(task: Task) {
    try {
      const [currentBalance, transactionCount, currentBlockNumber] =
        await Promise.all([
          this.caverService.getBalance(task.accountAddress),
          this.caverService.getTransactionCount(task.accountAddress),
          this.caverService.getCurrentBlockNumber(),
        ]);

      logger.info(`balance: ${currentBalance}`);
      logger.info(`transactionCount: ${transactionCount}`);
      logger.info(`currentBlockNumber: ${currentBlockNumber}`);

      const message = new SlackMessage(
        task.accountAddress,
        task.accountName,
        currentBalance,
        transactionCount,
        currentBlockNumber,
        this.isAnomalyDetected(
          task.accountAddress,
          currentBalance,
          transactionCount,
        ),
      ).payload;

      await this.slackService.sendMessage(message);
    } catch (error) {
      logger.error(`Error occurred while processing ${task.accountName}: ${error}`);
    }
  }

  @CronJob(CronExpression.EVERY_HOUR)
  handleCron1() {
    this.isCronJobActive = true;
    this.processTasks(0);
  }

  @CronJob(CronExpression.EVERY_10_MINUTES)
  handleCron2() {
    this.isCronJobActive = true;
    this.processTasks(1);
  }

  @CronJob(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron3() {
    this.isCronJobActive = true;
    this.processTasks(2, 5);
  }

  private async processTasks(startIndex: number, endIndex?: number) {
    const tasksToProcess = endIndex
      ? this.tasks.slice(startIndex, endIndex + 1)
      : [this.tasks[startIndex]];

    await Promise.all(
      tasksToProcess.map((task) => this.getAccountByCaverAndSendSlack(task)),
    );

    this.isCronJobActive = false;
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

class Task {
  constructor(
    public readonly accountAddress: string,
    public readonly accountName: string,
  ) {}
}