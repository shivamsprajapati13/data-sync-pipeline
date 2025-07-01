# 🔁 CSV Sync Pipeline using NestJS + PostgreSQL

A NestJS-based application to sync data from a compressed weekly-updated CSV file (`sample.zip`) into a PostgreSQL database. The pipeline handles **inserts**, **updates**, and **deletes** based on a unique `ref_id` column.

---

## 🧱 Tech Stack

- **NestJS** (Node.js framework)
- **PostgreSQL** (Relational database)
- **TypeORM** (ORM for DB interaction)
- **fast-csv** (CSV parsing)
- **unzipper** (Extracting zip files)
- **@nestjs/schedule** (Cron jobs)
- **TypeScript**

## 📦 Initial Setup and Dependencies

### 1. Clone the repository

```bash
git clone https://github.com/shivamsprajapati13/data-sync-pipeline.git
cd csv-sync-pipeline
```

### 2. Install dependencies
```
pnpm install
```

### 3. PostgreSQL Setup
You can either let TypeORM sync the schema or manually run this:
```
DROP TABLE IF EXISTS cur_data;

CREATE TABLE cur_data (
  id SERIAL PRIMARY KEY,
  ref_id VARCHAR NOT NULL UNIQUE,  
  name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Optional Indexes
CREATE INDEX idx_cur_data_ref_id ON cur_data(ref_id);
```

### ▶️ Running the Application
```
pnpm run start:dev
```

### 📥 Manual Sync via API
An optional endpoint exists to trigger sync manually:

POST /sync
```
curl --location --request POST 'http://localhost:3000/sync' \
--data ''
```

### Example Response
```
{
    "message": "CSV sync complete",
    "inserted": [
        {
            "refId": "5",
            "name": "demo",
            "value": 985,
            "id": 7,
            "lastUpdated": "2025-07-01T16:45:41.842Z"
        }
    ],
    "updated": [],
    "deleted": []
}
```

### This endpoint:
```
1. Unzips sample.zip from src/assets/
2. Parses the CSV
3. Compares with DB data using ref_id
4. Applies necessary inserts/updates/deletes
```

### ⏱ Automated Sync via Cron Job
The app includes an internal cron job using @nestjs/schedule.
```
@Cron('*/30 * * * * *') // every 30 seconds
async handleCron() {
  await this.syncService.syncFromZip('src/assets/sample.zip');
}
```

### Output
```
[Nest] 1928  - 07/01/2025, 10:14:45 PM     LOG [cronService] Running weekly cron job
[Nest] 1928  - 07/01/2025, 10:14:45 PM     LOG [cronService] Sync Result: {"inserted":[],"updated":[],"deleted":[]}
[Nest] 1928  - 07/01/2025, 10:15:00 PM     LOG [cronService] Running weekly cron job
[Nest] 1928  - 07/01/2025, 10:15:00 PM     LOG [cronService] Sync Result: {"inserted":[],"updated":[],"deleted":[]}
[Nest] 1928  - 07/01/2025, 10:15:15 PM     LOG [cronService] Running weekly cron job
[Nest] 1928  - 07/01/2025, 10:15:15 PM     LOG [cronService] Sync Result: {"inserted":[],"updated":[],"deleted":[]}
[Nest] 1928  - 07/01/2025, 10:15:30 PM     LOG [cronService] Running weekly cron job
[Nest] 1928  - 07/01/2025, 10:15:41 PM     LOG [cronService] Sync Result: {"inserted":[{"refId":"5","name":"demo","value":985,"id":7,"lastUpdated":"2025-07-01T16:45:41.842Z"}],"updated":[],"deleted":[]}

```
### 🧪 Test Checklist
```
✅ Place sample.zip in src/assets/

✅ Ensure the CSV inside has a ref_id column

✅ PostgreSQL is running and schema is created

✅ dist/assets/ directory exists
```

