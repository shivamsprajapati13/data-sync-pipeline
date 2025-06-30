// src/cur-data/cur-data.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurData } from 'src/entity/syncEntity';
import { SyncController } from 'src/controller/syncController';
import { SyncService } from 'src/service/syncService';
import { ScheduleModule } from '@nestjs/schedule';
import { cronService } from 'src/service/cronService';
@Module({
  imports: [TypeOrmModule.forFeature([CurData]),
ScheduleModule.forRoot(), ],
  controllers: [SyncController],
  providers: [SyncService,cronService],
})
export class CurDataModule {}
