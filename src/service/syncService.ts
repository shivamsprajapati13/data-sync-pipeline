import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as unzipper from 'unzipper';
import * as csvParser from 'csv-parser';
import { CurData } from 'src/entity/syncEntity';
@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(CurData)
    private readonly curDataRepo: Repository<CurData>,
  ) {}

  /**
   * Main sync function
   * Downloads (simulated), unzips, parses, compares, syncs and logs
   */
  async syncFromZip(zipPath: string): Promise<{
  inserted: CurData[];
  updated: CurData[];
  deleted: string[]; // refIds
}> {
  const extractPath = path.join(__dirname, '..', 'assets', 'extracted.csv');
  const logPath = path.join(__dirname, '..', 'assets', 'sync.log');

  const inserted: CurData[] = [];
  const updated: CurData[] = [];
  const deleted: string[] = [];

  try {
    await this.unzipFile(zipPath, extractPath);
    this.log(logPath, `✅ Unzipped file`);

    const parsedRows = await this.parseCsv(extractPath);
    const existing = await this.curDataRepo.find();
    const existingMap = new Map(existing.map((row) => [row.refId, row]));

    for (const row of parsedRows) {
      const existingRow = existingMap.get(row.refId);

      if (!existingRow) {
        await this.curDataRepo.insert(row);
        inserted.push(row);
        this.log(logPath, `➕ Inserted: ${row.refId}`);
      } else if (
        existingRow.name !== row.name ||
        +existingRow.value !== +row.value
      ) {
        await this.curDataRepo.update({ refId: row.refId }, row);
        updated.push(row);
        this.log(logPath, `🔄 Updated: ${row.refId}`);
      }

      existingMap.delete(row.refId);
    }

    for (const [refId] of existingMap) {
      await this.curDataRepo.delete({ refId });
      deleted.push(refId);
      this.log(logPath, `❌ Deleted: ${refId}`);
    }

    this.log(logPath, `✅ Sync complete!`);
    return { inserted, updated, deleted };
  } catch (err) {
    this.log(logPath, `🔥 Error: ${err.message}`);
    throw err;
  }
}


  private async unzipFile(zipPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.createReadStream(zipPath)
        .pipe(unzipper.ParseOne()) // Extract only first entry
        .pipe(fs.createWriteStream(outputPath))
        .on('finish', resolve)
        .on('error', reject);
    });
  }

  private async parseCsv(filePath: string): Promise<CurData[]> {
    const rows: CurData[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          if (row.ref_id && row.name && row.value) {
            rows.push({
              refId: row.ref_id,
              name: row.name,
              value: parseFloat(row.value),
            } as CurData);
          }
        })
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
  }

private log(logFilePath: string, message: string) {
const assetPath = path.join(process.cwd(), 'dist', 'assets'); // use this for dist-safe path

  // ✅ Ensure directory exists
  if (!fs.existsSync(assetPath)) {
    fs.mkdirSync(assetPath, { recursive: true });
  }

  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
}
}
