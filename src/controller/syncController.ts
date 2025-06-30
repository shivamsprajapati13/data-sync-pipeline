import { Controller, Post } from '@nestjs/common';
import { SyncService } from 'src/service/syncService';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  async triggerSync() {
    const zipPath = 'src/assets/sample.zip';
  const result = await this.syncService.syncFromZip(zipPath);
    return { message: 'CSV sync complete',
       ...result
     };
  }
}
