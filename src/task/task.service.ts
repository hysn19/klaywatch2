import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
    private isCronJobActive: boolean = false;

    @Cron('0 * * * * *')
    handleCron() {
        this.isCronJobActive = true;
        console.log('Cron 작업이 실행되었습니다!');
    }

    isCronJobRunning(): boolean {
        return this.isCronJobActive;
    }

}