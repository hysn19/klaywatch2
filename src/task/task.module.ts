import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { SlackService } from '../slack/slack.service';
import { CaverService } from '../klaytn/caver/caver.service';

@Module({
  providers: [TaskService, SlackService, CaverService],
})
export class TaskModule { }
