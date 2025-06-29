import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurDataModule } from './module/syncModule';

@Module({
  imports: [
  TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'demo',
      database: 'salesdb',
      autoLoadEntities: true,
      synchronize: true, // OK for dev only
    }),
    CurDataModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
