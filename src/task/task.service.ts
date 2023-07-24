import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { SlackService } from '../slack/slack.service';
import { CaverService } from '../klaytn/caver/caver.service'
import { SlackMessage } from '../slack/slack.messge';
import { logger } from 'config/winston';


@Injectable()
export class TaskService {
    private slackService = new SlackService('https://hooks.slack.com/services/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');
    private caverService = new CaverService('https://public-node-api.klaytnapi.com/v1/cypress');

    private isCronJobActive: boolean = false;

    @Cron('0 */10 * * * *') // run every 10 minutes
    async handleCron1() {
        this.isCronJobActive = true;

        let accountAddress = '0x2fd3ff6e4ead7430ea25bab5e5b2b073492b7e6e'
        let accountName = 'Reward: Kakao Pay 3'

        const [currentBalance, transactionCount, currentBlockNumber, /* blockHistory */] = await Promise.all([
            this.caverService.getBalance(accountAddress),
            this.caverService.getTransactionCount(accountAddress),
            this.caverService.getCurrentBlockNumber(),
            // this.caverService.getBlockHistory(112020370, (await this.caverService.getCurrentBlockNumber()))
        ]);

        logger.info(`balance: ${currentBalance}`)
        logger.info(`transactionCount: ${transactionCount}`)
        logger.info(`currentBlockNumber: ${currentBlockNumber}`)
        // logger.info(`blockHistory: ${blockHistory}`)

        const message = new SlackMessage(accountAddress, accountName, currentBalance, transactionCount, currentBlockNumber)

        await this.slackService.sendMessage(message);
    }

    @Cron('0 0 * * * *') // runs every hour at the 0 minute.
    async handleCron2() {
        this.isCronJobActive = true;

        let accountAddress = '0x1f55eadcc398e9a2d3b8b505c993e19d210786bf'
        let accountName = 'Reward: Kakao Pay'

        const [currentBalance, transactionCount, currentBlockNumber] = await Promise.all([
            this.caverService.getBalance(accountAddress),
            this.caverService.getTransactionCount(accountAddress),
            this.caverService.getCurrentBlockNumber(),
        ]);

        logger.info(`balance: ${currentBalance}`)
        logger.info(`transactionCount: ${transactionCount}`)
        logger.info(`currentBlockNumber: ${currentBlockNumber}`)

        const message = new SlackMessage(accountAddress, accountName, currentBalance, transactionCount, currentBlockNumber)

        await this.slackService.sendMessage(message);
    }

    @Cron('0 0 0 * * *') // run every midnight
    async handleCron3() {
        this.isCronJobActive = true;

        const array = [
            { accountAddress: '0x2888d9dcbd6cefb92a76712eca61391c37df8122', accountName: 'StakingV1 Account' },
            { accountAddress: '0x4Ff8B6c558cBA6b20c962F301908D1D70cEEEA7c', accountName: 'StakingV2 Account' },
            { accountAddress: '0xbe02aba56bae1624e2c4f029e3a79308e2a19e98', accountName: 'AuthFee Account' },
            { accountAddress: '0x020794caf06273ef3a9b4b0323c72341ec070b15', accountName: 'Reward1 Account' },
        ];

        array.forEach(async (account) => {
            const [currentBalance, transactionCount, currentBlockNumber] = await Promise.all([
                this.caverService.getBalance(account.accountAddress),
                this.caverService.getTransactionCount(account.accountAddress),
                this.caverService.getCurrentBlockNumber(),
            ]);

            logger.info(`balance: ${currentBalance}`)
            logger.info(`transactionCount: ${transactionCount}`)
            logger.info(`currentBlockNumber: ${currentBlockNumber}`)

            const message = new SlackMessage(
                account.accountAddress,
                account.accountName,
                currentBalance,
                transactionCount,
                currentBlockNumber
            )

            await this.slackService.sendMessage(message);
        })
    }

    isCronJobRunning(): boolean {
        return this.isCronJobActive;
    }

}