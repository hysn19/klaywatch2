import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
    let taskService: TaskService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TaskService],
        }).compile();

        taskService = module.get<TaskService>(TaskService);
    });

    it('should be defined', () => {
        expect(taskService).toBeDefined();
    });

    it('should handle cron job', () => {
        // Jest의 useFakeTimers()를 사용하여 시간을 조작할 수 있음
        jest.useFakeTimers();

        // handleCron() 메서드를 호출하기 전에 Cron 작업이 실행되지 않았을 것으로 예상
        expect(taskService.isCronJobRunning()).toBe(false);

        // handleCron() 메서드를 호출하면 Cron 작업이 실행되도록 예상
        taskService.handleCron();
        expect(taskService.isCronJobRunning()).toBe(true);
    });

});
