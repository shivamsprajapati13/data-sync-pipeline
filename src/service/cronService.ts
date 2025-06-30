// src/your-cron.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SyncService } from 'src/service/syncService';


@Injectable()
export class cronService {
    constructor(private readonly syncService: SyncService) {}
  private readonly logger = new Logger(cronService.name);


  @Cron('*/15 * * * * *')
  async handleCron() {
    this.logger.log('Running weekly cron job');
        const zipPath = 'src/assets/sample.zip';
  try {
    const result = await this.syncService.syncFromZip(zipPath);
    this.logger.log(`Sync Result: ${JSON.stringify(result)}`);
  } catch (err) {
    this.logger.error('Cron job failed', err.stack);
  }
}
}
