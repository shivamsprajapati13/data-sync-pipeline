// src/cur-data/cur-data.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurData } from 'src/entity/syncEntity';
import { SyncController } from 'src/controller/syncController';
import { SyncService } from 'src/service/syncService';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from 'src/service/cronService';
import { CronController } from 'src/controller/cronController';
@Module({
  imports: [TypeOrmModule.forFeature([CurData]),
ScheduleModule.forRoot(), ],
  controllers: [SyncController,CronController],
  providers: [SyncService,CronService],
})
export class CurDataModule {}
