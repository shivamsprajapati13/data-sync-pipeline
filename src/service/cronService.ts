// your-cron.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { SyncService } from 'src/service/syncService';

@Injectable()
export class CronService implements OnModuleInit {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly syncService: SyncService,
  ) {}

  onModuleInit() {
    this.startJob(); // optional: auto-start at app boot
  }

  startJob() {
    if (this.schedulerRegistry.doesExist('cron', 'syncJob')) {
      this.logger.warn('syncJob already exists.');
      return;
    }

    const job = new CronJob('*/15 * * * * *', async () => {
      this.logger.log('Executing scheduled sync...');

      try {
        const result = await this.syncService.syncFromZip('src/assets/sample.zip');
        this.logger.log(`Sync Result: ${JSON.stringify(result)}`);
      } catch (error) {
        this.logger.error('Error during scheduled sync', error.stack);
      }
    });

    this.schedulerRegistry.addCronJob('syncJob',job as any); // ✅ Registers the job
    job.start(); // ✅ Starts it
    this.logger.log('syncJob has been started.');
  }

  stopJob() {
    if (!this.schedulerRegistry.doesExist('cron', 'syncJob')) {
      this.logger.warn('syncJob not found.');
      return;
    }

    const job = this.schedulerRegistry.getCronJob('syncJob');
    job.stop();
    this.schedulerRegistry.deleteCronJob('syncJob');
    this.logger.log('syncJob has been stopped and removed.');
  }
}
