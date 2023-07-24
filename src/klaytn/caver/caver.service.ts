import { Injectable } from '@nestjs/common';
import { logger } from 'config/winston';

import * as Caver from 'caver-js/index';

@Injectable()
export class CaverService {
    private readonly caver: Caver

    constructor(rpcUrl: string) {
        this.caver = new Caver(rpcUrl)
    }

    async getBalance(accountAddress: string) {
        try {
            const balance = await this.caver.rpc.klay.getBalance(accountAddress);
            const klay = this.caver.utils.convertFromPeb(balance, 'KLAY')
            logger.debug(`계정 주소: ${accountAddress}`);
            logger.debug(`잔액: ${klay} KLAY`);
            return klay;
        } catch (error) {
            logger.error('잔액 조회 오류:', error);
        }
    }

    async getTransactionCount(accountAddress: string) {
        try {
            const hexTransactionCount = await this.caver.rpc.klay.getTransactionCount(accountAddress);
            const decimalTransactionCount = this.caver.utils.hexToNumber(hexTransactionCount);
            logger.debug(`트랜잭션 수: ${decimalTransactionCount}`);
            return decimalTransactionCount;
        } catch (error) {
            logger.error('트랜잭션 카운트 조회 오류:', error);
        }
    }

    async getCurrentBlockNumber() {
        try {
            const hexBlockNumber = await this.caver.rpc.klay.getBlockNumber();
            const decimalBlockNumber = this.caver.utils.hexToNumber(hexBlockNumber);
            logger.debug(`현재 블록 번호: ${decimalBlockNumber}`);
            return decimalBlockNumber;
        } catch (error) {
            logger.error('블록 번호 조회 오류:', error);
        }
    }

    async getBlockHistory(startBlockNumber: number, endBlockNumber: number) {
        try {
            for (let blockNumber = startBlockNumber; blockNumber <= endBlockNumber; blockNumber++) {
                const block = await this.caver.rpc.klay.getBlockByNumber(blockNumber);
                logger.debug(`블록 번호: ${block.number}`);
                logger.debug(`이전 블록 번호: ${block.parentHash}`);
                logger.debug(`트랜잭션 수: ${block.transactions.length}`);
            }
        } catch (error) {
            logger.error('블록 히스토리 조회 오류:', error);
        }
    }

}