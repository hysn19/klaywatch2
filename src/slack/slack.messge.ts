var date = new Date();

export class SlackMessage {
    constructor(accountAddress: string, accountName: string, currentBalance: string, transactionCount: string, currentBlockNumber: string) {
        this.template = {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: ':bell: 클레이워치 알람이 도착했어요 :bell:'
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: '<https://scope.klaytn.com/account/' + accountAddress + '?tabId=txList|' + accountName + '>'
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
                            text: '*Balance:*\n' + currentBalance + ' KLAY'
                        },
                        {
                            type: 'mrkdwn',
                            text: '*BlockNumber:*\n' + currentBlockNumber + ''
                        },
                        {
                            type: 'mrkdwn',
                            text: '*DateTime:*\n' + date.toLocaleString() + ''
                        },
                        {
                            type: 'mrkdwn',
                            text: '*Transaction Count :*\n' + transactionCount
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

    template: object;
};