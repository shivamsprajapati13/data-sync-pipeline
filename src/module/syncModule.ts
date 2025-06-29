// src/cur-data/cur-data.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurData } from 'src/entity/syncEntity';
import { SyncController } from 'src/controller/syncController';
import { SyncService } from 'src/service/syncService';

@Module({
  imports: [TypeOrmModule.forFeature([CurData])],
  controllers: [SyncController],
  providers: [SyncService],
})
export class CurDataModule {}
