// src/cron/cron.controller.ts
import { Controller, Post } from '@nestjs/common';
import { CronService } from 'src/service/cronService';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Post('start')
  start() {
    this.cronService.startJob();
    return { message: 'Cron started' };
  }

  @Post('stop')
  stop() {
    this.cronService.stopJob();
    return { message: 'Cron stopped' };
  }
}
