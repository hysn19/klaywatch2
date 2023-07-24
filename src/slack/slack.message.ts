import { Injectable } from "@nestjs/common";

import * as dayjs from "dayjs";
import * as timezone from "dayjs/plugin/timezone";
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul')

@Injectable()
export class SlackMessage {
    constructor(accountAddress: string, accountName: string, currentBalance: string, transactionCount: string, currentBlockNumber: string, isAnomalyDetected: boolean = false) {
        this.payload = {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: ':bell: 계정 점검 알람이 도착했어요 :bell:'
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `*계정 <https://scope.klaytn.com/account/${accountAddress}?tabId=txList|${accountName}>*`
                    }
                },
                {
                    type: 'divider'
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: isAnomalyDetected ? `*점검결과:*\n:white_check_mark: 이상없음 :white_check_mark:` : `*점검결과:*\n:rotating_light: 이상감지(계정 상태를 확인해주세요) :rotating_light:`
                        },
                        {
                            type: 'mrkdwn',
                            text: `*클레이 수량 (블록번호):*\n${currentBalance} KLAY (<https://scope.klaytn.com/block/${currentBlockNumber}?tabId=txList|${currentBlockNumber}>)`
                        },
                        {
                            type: 'mrkdwn',
                            text: `*점검일시:*\n${dayjs().tz().format()}`
                        },

                        {
                            type: 'mrkdwn',
                            text: `*트랜잭션 갯수 :*\n${transactionCount}`
                        }
                    ]
                },
                {
                    type: 'divider'
                },
                {
                    type: 'context',
                    elements: [
                        {
                            type: 'mrkdwn',
                            text: ':pushpin: 문의 사항은? #proj-klay보고'
                        }
                    ]
                }
            ]
        };
    }

    payload: object;
}
